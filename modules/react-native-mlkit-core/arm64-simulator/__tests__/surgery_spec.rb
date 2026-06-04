#!/usr/bin/env ruby
# frozen_string_literal: true

# Standalone tests for the pure-Ruby parts of the arm64-simulator hook (the
# parts that don't require the Xcode toolchain). Run directly:
#
#   ruby surgery_spec.rb
#
# Exit code 0 = all passed, non-zero = failure. A jest wrapper
# (ruby-surgery.test.js) runs this in CI and skips if ruby is unavailable.

require "fileutils"
require "tmpdir"
require "pathname"

here = File.dirname(__FILE__)
require File.join(here, "..", "mlkit_arm64_sim.rb")

$failures = 0
def check(desc)
  ok = yield
  puts "#{ok ? 'ok  ' : 'FAIL'} - #{desc}"
  $failures += 1 unless ok
rescue => e
  puts "FAIL - #{desc} (#{e.class}: #{e.message})"
  $failures += 1
end

# --- clear_exclusion_in_settings -------------------------------------------
check("arm64-only EXCLUDED_ARCHS deletes the key") do
  s = { RNMLKitArm64Sim::EXCLUDED_KEY => "arm64" }
  RNMLKitArm64Sim.clear_exclusion_in_settings(s)
  !s.key?(RNMLKitArm64Sim::EXCLUDED_KEY)
end

check("EXCLUDED_ARCHS with arm64 + i386 keeps i386") do
  s = { RNMLKitArm64Sim::EXCLUDED_KEY => "arm64 i386" }
  RNMLKitArm64Sim.clear_exclusion_in_settings(s)
  s[RNMLKitArm64Sim::EXCLUDED_KEY] == "i386"
end

check("array-valued EXCLUDED_ARCHS is handled") do
  s = { RNMLKitArm64Sim::EXCLUDED_KEY => ["arm64"] }
  RNMLKitArm64Sim.clear_exclusion_in_settings(s)
  !s.key?(RNMLKitArm64Sim::EXCLUDED_KEY)
end

# --- strip_exclusion_in_xcconfigs ------------------------------------------
Dir.mktmpdir do |root|
  tsf = File.join(root, "Target Support Files", "Pods-App")
  FileUtils.mkdir_p(tsf)
  debug = File.join(tsf, "Pods-App.debug.xcconfig")
  rel = File.join(tsf, "Pods-App.release.xcconfig")
  File.write(debug, "OTHER_LDFLAGS = $(inherited)\nEXCLUDED_ARCHS[sdk=iphonesimulator*] = arm64\nPODS_ROOT = x\n")
  File.write(rel, "EXCLUDED_ARCHS[sdk=iphonesimulator*] = arm64 i386\nFOO = bar\n")

  RNMLKitArm64Sim.strip_exclusion_in_xcconfigs(Pathname.new(root))

  check("xcconfig: key contains '=' but value is parsed correctly (no corruption)") do
    !File.read(debug).include?("iphonesimulator*] = iphonesimulator")
  end
  check("xcconfig: arm64-only line removed") do
    !File.read(debug).match?(/EXCLUDED_ARCHS\[sdk=iphonesimulator\*\]/)
  end
  check("xcconfig: arm64 stripped, other archs kept") do
    File.read(rel).include?("EXCLUDED_ARCHS[sdk=iphonesimulator*] = i386")
  end
  check("xcconfig: unrelated lines preserved") do
    File.read(debug).include?("PODS_ROOT = x") && File.read(rel).include?("FOO = bar")
  end
  check("xcconfig: stripping is idempotent") do
    before = File.read(debug)
    RNMLKitArm64Sim.strip_exclusion_in_xcconfigs(Pathname.new(root))
    before == File.read(debug)
  end
end

# --- rewire_simulator_linkage (idempotent, no duplicate) -------------------
Config = Struct.new(:build_settings)
FakeTarget = Struct.new(:build_configurations)
FakeSandbox = Struct.new(:root)
class FakeProject
  attr_reader :build_configurations, :targets
  def initialize(c, t); @build_configurations = c; @targets = t; end
  def save; end
end
FakeInstaller = Struct.new(:pods_project, :sandbox)

c1 = Config.new({})
c2 = Config.new({ RNMLKitArm64Sim::SEARCH_PATHS_KEY => "$(inherited)" })
inst = FakeInstaller.new(FakeProject.new([c1], [FakeTarget.new([c2])]),
                         FakeSandbox.new(Pathname.new("/tmp/Pods")))
out = "/tmp/Pods/.rnmlkit-arm64sim"
RNMLKitArm64Sim.rewire_simulator_linkage(inst, out)
RNMLKitArm64Sim.rewire_simulator_linkage(inst, out) # twice → still one entry

check("rewire adds the converted dir to the simulator search path") do
  c1.build_settings[RNMLKitArm64Sim::SEARCH_PATHS_KEY].include?("\"#{out}\"")
end
check("rewire keeps $(inherited) first") do
  c1.build_settings[RNMLKitArm64Sim::SEARCH_PATHS_KEY].first == "$(inherited)"
end
check("rewire is idempotent (no duplicate entries)") do
  c1.build_settings[RNMLKitArm64Sim::SEARCH_PATHS_KEY].count("\"#{out}\"") == 1 &&
    c2.build_settings[RNMLKitArm64Sim::SEARCH_PATHS_KEY].count("\"#{out}\"") == 1
end

# --- discovery scoping -----------------------------------------------------
check("google_pod? matches MLKit/Google pods") do
  RNMLKitArm64Sim.google_pod?("/Pods", "/Pods/MLImage/Frameworks/MLImage.framework") &&
    RNMLKitArm64Sim.google_pod?("/Pods", "/Pods/GoogleDataTransport/x/GoogleDataTransport.framework")
end
check("google_pod? ignores unrelated pods") do
  !RNMLKitArm64Sim.google_pod?("/Pods", "/Pods/SomeOtherPod/Foo.framework")
end

# --- layout-change safety (transmogrify fails loud, not silent) ------------
Dir.mktmpdir do |d|
  fw = File.join(d, "Future.framework")
  FileUtils.mkdir_p(fw) # framework dir with NO binary inside
  check("transmogrify raises LayoutError when the binary is missing") do
    begin
      Transmogrify::Converter.new(fw).convert!
      false
    rescue Transmogrify::LayoutError => e
      e.message.include?("Future") # names the framework
    end
  end
end

# --- transmogrify sentinel logic -------------------------------------------
check("sentinel is not 'current' when output does not exist") do
  conv = Transmogrify::Converter.new("/nope/X.framework")
  !conv.send(:sentinel_current?, "/nope/out/X.framework", "/nope/bin")
end

puts($failures.zero? ? "\nALL PASSED" : "\n#{$failures} FAILURE(S)")
exit($failures.zero? ? 0 : 1)
