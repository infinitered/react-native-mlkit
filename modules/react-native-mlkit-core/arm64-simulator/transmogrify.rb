#!/usr/bin/env ruby
# frozen_string_literal: true

# ---------------------------------------------------------------------------
# transmogrify.rb — experimental arm64 iOS-Simulator transform for MLKit pods
#
# Part of @infinitered/react-native-mlkit-core. See ./PHASE-0-FINDINGS.md and
# ./README.md for the full design and the App-Store-safety guarantees.
#
# WHAT IT DOES
#   Given one Google MLKit `.framework` that CocoaPods already downloaded into
#   `Pods/` (a fat framework with an `ios-arm64` *device* slice and an
#   `x86_64` *simulator* slice but NO `arm64` *simulator* slice), it produces a
#   SIMULATOR-ONLY copy of that framework whose Mach-O contains:
#
#       arm64   (the device slice, retagged to the iOS-Simulator platform)
#     + x86_64  (the original simulator slice, when present — "Option B")
#
#   The copy is written to an output dir (default `<Pods>/.rnmlkit-arm64sim`).
#   The original device framework is NEVER modified, so device / Release / App
#   Store builds keep linking the pristine, Google-signed binary.
#
# IT USES ONLY XCODE COMMAND-LINE TOOLS: lipo, vtool, otool, codesign, file.
# No third-party packaging tool is required.
#
# USAGE
#   ruby transmogrify.rb [options] /path/to/Pods/MLImage/.../MLImage.framework
#
#     --output DIR     Where to write <Name>.framework  (default: alongside, in
#                      a `.rnmlkit-arm64sim` sibling of the framework's pod)
#     --no-x86_64      Emit an arm64-only simulator slice (Option A) even if an
#                      x86_64 simulator slice is available.
#     --dry-run        Print every command that would run; change nothing.
#     --verbose, -v    Print each command as it runs.
#     --force          Ignore the idempotency sentinel and rebuild.
#     --help, -h       This message.
#
# EXIT CODES
#   0  success (converted) or no-op (already converted / nothing to do)
#   1  layout assertion failed — the framework did not look the way we expect
#      (e.g. a future MLKit version moved files or changed slices). The message
#      names the framework so a maintainer can update the script. Fails LOUD.
#   2  a required tool was missing or a shell command failed.
# ---------------------------------------------------------------------------

require "json"
require "fileutils"
require "optparse"
require "digest"
require "tmpdir"

module Transmogrify
  # Mach-O platform id for the iOS Simulator (see <mach-o/loader.h>:
  # PLATFORM_IOSSIMULATOR = 7). PLATFORM_IOS (device) = 2.
  PLATFORM_IOS_SIMULATOR = 7
  PLATFORM_IOS_DEVICE = 2

  # Marker written into each converted framework so a second run is a no-op.
  SENTINEL = ".rnmlkit-arm64sim.json"
  # Bump when the transform logic changes in a way that invalidates old output.
  SCRIPT_VERSION = "1"

  class LayoutError < StandardError; end
  class ToolError < StandardError; end

  class Converter
    def initialize(framework_path, output_dir: nil, keep_x86_64: true,
                   dry_run: false, verbose: false, force: false, logger: $stdout)
      @framework = File.expand_path(framework_path.to_s.chomp("/"))
      @output_dir = output_dir && File.expand_path(output_dir)
      @keep_x86_64 = keep_x86_64
      @dry_run = dry_run
      @verbose = verbose || dry_run
      @force = force
      @log = logger
    end

    # Returns the path to the converted simulator `.framework`, or nil if the
    # framework did not need conversion. Raises LayoutError / ToolError.
    def convert!
      assert_layout!

      name = framework_name
      bin = binary_path
      archs = lipo_archs(bin)
      log "#{name}: source slices = [#{archs.join(', ')}]"

      unless archs.include?("arm64")
        raise LayoutError, "#{name}: expected an 'arm64' slice in #{rel(bin)}, " \
          "found [#{archs.join(', ')}]. Detected MLKit version: #{detected_mlkit_version}"
      end

      # If the source already carries an arm64 *simulator* slice, Google has
      # started shipping xcframeworks / fat sim slices and we must do nothing.
      if arm64_simulator_already_present?(bin, archs)
        log "#{name}: source already has an arm64 simulator slice — skipping (nothing to do)."
        return nil
      end

      out_fw = File.join(output_root, "#{name}.framework")

      if !@force && sentinel_current?(out_fw, bin)
        log "#{name}: already converted and up to date — skipping (idempotent)."
        return out_fw
      end

      build(out_fw, name, bin, archs)
      out_fw
    end

    private

    # ----- layout assertions (fail loud) ------------------------------------

    def assert_layout!
      unless File.directory?(@framework) && @framework.end_with?(".framework")
        raise LayoutError, "Not a .framework bundle: #{@framework}"
      end
      unless File.file?(binary_path)
        raise LayoutError, "#{framework_name}: could not locate the Mach-O " \
          "binary (looked for #{rel(binary_path)}). The framework layout is " \
          "unexpected. Detected MLKit version: #{detected_mlkit_version}"
      end
    end

    def framework_name
      File.basename(@framework, ".framework")
    end

    # The executable is usually `<Name>.framework/<Name>`, but honour
    # Info.plist's CFBundleExecutable when present (flat vs versioned bundles).
    def binary_path
      @binary_path ||= begin
        default = File.join(@framework, framework_name)
        plist = File.join(@framework, "Info.plist")
        exe = nil
        if File.file?(plist)
          # Avoid depending on PlistBuddy/CFPropertyList; a cheap grep is enough
          # and we fall back to the conventional name on any miss.
          raw = File.read(plist) rescue ""
          if raw =~ /CFBundleExecutable<\/key>\s*<string>([^<]+)<\/string>/m
            cand = File.join(@framework, Regexp.last_match(1))
            exe = cand if File.file?(cand)
          end
        end
        exe || default
      end
    end

    # ----- slice inspection -------------------------------------------------

    def lipo_archs(bin)
      out = capture("lipo", "-archs", bin)
      out.split(/\s+/).reject(&:empty?)
    end

    def static?(bin)
      # A static framework's Mach-O is an ar archive of objects; a dynamic one
      # is a MH_DYLIB. `file` distinguishes them reliably across slices.
      desc = capture("file", "-b", bin)
      desc.include?("archive") || desc.include?("current ar archive") ||
        capture("otool", "-hv", bin).include?(" OBJECT ")
    rescue ToolError
      false
    end

    # True only when there is an arm64 slice whose build-version platform is the
    # simulator (i.e. the work is already done upstream).
    def arm64_simulator_already_present?(bin, archs)
      return false unless archs.include?("arm64")
      platform_of_slice(bin, "arm64") == PLATFORM_IOS_SIMULATOR
    rescue ToolError, LayoutError
      false
    end

    # Reads the LC_BUILD_VERSION (or LC_VERSION_MIN_IPHONEOS) platform for one
    # arch slice. Returns an Integer platform id, or nil if none found.
    def platform_of_slice(bin, arch)
      load_cmds = capture("otool", "-l", "-arch", arch, bin)
      # Newer toolchains: LC_BUILD_VERSION -> "platform <n>" (numeric) or a
      # symbolic name; older: LC_VERSION_MIN_IPHONEOS implies device (2).
      if load_cmds =~ /LC_BUILD_VERSION/
        if load_cmds =~ /platform\s+(\d+)/
          return Regexp.last_match(1).to_i
        end
        # Some otool versions print symbolic platform names.
        return PLATFORM_IOS_SIMULATOR if load_cmds =~ /platform\s+IOSSIMULATOR/i
        return PLATFORM_IOS_DEVICE if load_cmds =~ /platform\s+IOS\b/i
      end
      return PLATFORM_IOS_DEVICE if load_cmds =~ /LC_VERSION_MIN_IPHONEOS/
      nil
    end

    # minos / sdk to stamp into the retagged simulator slice. Reuse the source
    # arm64 slice's minos; default the sdk to the active simulator SDK.
    def build_version_for(bin)
      cmds = capture("otool", "-l", "-arch", "arm64", bin)
      minos = cmds[/minos\s+([0-9.]+)/, 1] || cmds[/version\s+([0-9.]+)/, 1] || "16.4"
      sdk = simulator_sdk_version || minos
      [minos, sdk]
    end

    def simulator_sdk_version
      capture("xcrun", "--sdk", "iphonesimulator", "--show-sdk-version").strip
    rescue ToolError
      nil
    end

    # ----- build ------------------------------------------------------------

    def build(out_fw, name, bin, archs)
      log "#{name}: converting → #{rel(out_fw)}"
      Dir.mktmpdir("rnmlkit-arm64sim-#{name}-") do |tmp|
        device_arm64 = File.join(tmp, "arm64-device.bin")
        sim_arm64 = File.join(tmp, "arm64-sim.bin")
        sim_bin = File.join(tmp, "sim.bin")

        run "lipo", bin, "-thin", "arm64", "-output", device_arm64
        retag_to_simulator(device_arm64, sim_arm64, bin, name)

        if @keep_x86_64 && archs.include?("x86_64")
          x86 = File.join(tmp, "x86_64-sim.bin")
          run "lipo", bin, "-thin", "x86_64", "-output", x86
          run "lipo", "-create", sim_arm64, x86, "-output", sim_bin
          log "#{name}: simulator slice = [arm64, x86_64] (Option B / universal)"
        else
          if @keep_x86_64
            log "#{name}: no x86_64 slice in source — emitting arm64-only " \
                "simulator slice (Option A fallback). Intel Macs cannot build " \
                "the simulator for this framework with the flag on."
          end
          run "cp", sim_arm64, sim_bin
        end

        # Verify the result really is simulator-tagged before we publish it.
        verify_simulator_slice(sim_bin, name)

        # Materialise the framework: copy the whole bundle (headers, modulemap,
        # Info.plist, nested .bundle model resources) then swap in the new
        # binary. We never touch the source on disk.
        stage = "#{out_fw}.tmp"
        rm_rf stage
        mkdir_p File.dirname(out_fw)
        run "cp", "-R", @framework, stage
        staged_bin = File.join(stage, File.basename(binary_path))
        # Preserve symlink/structure for the executable slot.
        rm_f staged_bin
        run "cp", sim_bin, staged_bin
        run "chmod", "+x", staged_bin

        ad_hoc_sign(stage, name)

        rm_rf out_fw
        run "mv", stage, out_fw
        write_sentinel(out_fw, bin, archs)
      end
      log "#{name}: done."
    end

    # Retag the device arm64 slice to the iOS-Simulator platform. Dynamic libs
    # retag in one `vtool` call; static archives may need a per-object pass on
    # older toolchains, so we try the fast path and fall back.
    def retag_to_simulator(input, output, source_bin, name)
      minos, sdk = build_version_for(source_bin)
      args = ["-arch", "arm64", "-set-build-version",
              PLATFORM_IOS_SIMULATOR.to_s, minos, sdk, "-replace",
              "-output", output, input]
      begin
        run "vtool", *args
      rescue ToolError => e
        if static?(input)
          log "#{name}: vtool could not retag the static archive directly " \
              "(#{e.message.lines.first&.strip}); retrying per-object."
          retag_static_archive(input, output, minos, sdk)
        else
          raise
        end
      end
    end

    # Fallback for static archives: explode with `ar`, retag each Mach-O object
    # with vtool, repack. Only used if the single-shot vtool path fails.
    def retag_static_archive(input, output, minos, sdk)
      Dir.mktmpdir("rnmlkit-ar-") do |ar_tmp|
        if @dry_run
          log "[dry-run] would ar-extract #{rel(input)}, vtool each object to " \
              "platform #{PLATFORM_IOS_SIMULATOR} (#{minos}/#{sdk}), and ar-repack → #{rel(output)}"
          return
        end
        members = capture("ar", "-t", input).split("\n").reject(&:empty?)
        raise ToolError, "ar listed no objects in #{input}" if members.empty?
        Dir.chdir(ar_tmp) { run "ar", "-x", input }
        members.each do |m|
          obj = File.join(ar_tmp, m)
          next unless File.file?(obj)
          run "vtool", "-set-build-version", PLATFORM_IOS_SIMULATOR.to_s,
              minos, sdk, "-replace", "-output", obj, obj
        end
        rm_f output
        Dir.chdir(ar_tmp) { run "ar", "-crs", output, *members } # objects are relative here
      end
    end

    def verify_simulator_slice(sim_bin, name)
      return if @dry_run
      archs = lipo_archs(sim_bin)
      unless archs.include?("arm64")
        raise LayoutError, "#{name}: produced binary lost its arm64 slice " \
          "(got [#{archs.join(', ')}]). Aborting rather than shipping a broken sim build."
      end
      plat = platform_of_slice(sim_bin, "arm64")
      unless plat == PLATFORM_IOS_SIMULATOR
        raise LayoutError, "#{name}: the arm64 slice did not retag to the " \
          "iOS-Simulator platform (got platform=#{plat.inspect}, expected " \
          "#{PLATFORM_IOS_SIMULATOR}). Your Xcode's vtool may behave " \
          "differently; please file an issue with `xcodebuild -version`."
      end
      log "#{name}: verified arm64 slice is simulator-tagged (platform #{plat})."
    end

    # Simulator dylibs must carry a valid (ad-hoc is fine) signature to load.
    # Static frameworks don't strictly need it but signing is harmless.
    def ad_hoc_sign(framework_dir, name)
      run "codesign", "--force", "--sign", "-", "--timestamp=none", framework_dir
    rescue ToolError => e
      log "#{name}: ad-hoc codesign skipped (#{e.message.lines.first&.strip})."
    end

    # ----- sentinel / idempotency ------------------------------------------

    def sentinel_path(out_fw)
      File.join(out_fw, SENTINEL)
    end

    def sentinel_current?(out_fw, source_bin)
      path = sentinel_path(out_fw)
      return false unless File.file?(path)
      data = JSON.parse(File.read(path)) rescue (return false)
      data["scriptVersion"] == SCRIPT_VERSION &&
        data["sourceFingerprint"] == source_fingerprint(source_bin) &&
        data["keepX86_64"] == @keep_x86_64
    end

    def write_sentinel(out_fw, source_bin, archs)
      return if @dry_run
      File.write(sentinel_path(out_fw), JSON.pretty_generate(
        "scriptVersion" => SCRIPT_VERSION,
        "framework" => framework_name,
        "sourceArchs" => archs,
        "keepX86_64" => @keep_x86_64,
        "sourceFingerprint" => source_fingerprint(source_bin),
        "mlkitVersion" => detected_mlkit_version,
        "generatedAt" => Time.now.utc.iso8601
      ))
    end

    # Cheap, stable fingerprint of the source binary (size + mtime). Avoids
    # hashing large binaries on every install while still catching pod bumps.
    def source_fingerprint(source_bin)
      st = File.stat(source_bin)
      "#{st.size}-#{st.mtime.to_i}"
    end

    # Best-effort MLKit version for actionable error messages. Reads the
    # owning pod's podspec.json / .podspec or the Pods manifest if reachable.
    def detected_mlkit_version
      @detected_mlkit_version ||= begin
        dir = @framework
        version = "unknown"
        8.times do
          dir = File.dirname(dir)
          break if dir == "/" || dir.empty?
          spec = Dir.glob(File.join(dir, "*.podspec.json")).first
          if spec
            v = (JSON.parse(File.read(spec))["version"] rescue nil)
            (version = v; break) if v
          end
        end
        version
      end
    end

    # ----- shell helpers ----------------------------------------------------

    def output_root
      @output_dir || File.join(pod_root, ".rnmlkit-arm64sim")
    end

    # The pod's own directory under Pods/, used to site the default output dir.
    def pod_root
      File.dirname(@framework)
    end

    def run(*cmd)
      log "  $ #{cmd.join(' ')}" if @verbose
      return if @dry_run
      ok = system(*cmd)
      raise ToolError, "command failed (#{$?.exitstatus}): #{cmd.join(' ')}" unless ok
    rescue Errno::ENOENT
      raise ToolError, "required tool '#{cmd.first}' not found. Install Xcode " \
        "command-line tools (xcode-select --install)."
    end

    def capture(*cmd)
      require "open3"
      out, err, status = Open3.capture3(*cmd)
      unless status.success?
        raise ToolError, "command failed (#{status.exitstatus}): #{cmd.join(' ')}\n#{err}"
      end
      out
    rescue Errno::ENOENT
      raise ToolError, "required tool '#{cmd.first}' not found. Install Xcode " \
        "command-line tools (xcode-select --install)."
    end

    def mkdir_p(d) = @dry_run ? nil : FileUtils.mkdir_p(d)
    def rm_rf(d) = @dry_run ? nil : FileUtils.rm_rf(d)
    def rm_f(f) = @dry_run ? nil : FileUtils.rm_f(f)
    def rel(p) = p.to_s.sub(%r{\A#{Regexp.escape(Dir.pwd)}/}, "")
    def log(msg) = @log.puts("[rnmlkit-arm64sim] #{msg}")
  end

  # Module-level convenience used by the post_install hook (Phase 2).
  def self.convert(framework_path, **opts)
    Converter.new(framework_path, **opts).convert!
  end
end

# --------------------------------------------------------------------------
# CLI entry point
# --------------------------------------------------------------------------
if $PROGRAM_NAME == __FILE__
  options = { keep_x86_64: true, dry_run: false, verbose: false, force: false, output_dir: nil }
  parser = OptionParser.new do |o|
    o.banner = "Usage: ruby transmogrify.rb [options] /path/to/Name.framework"
    o.on("--output DIR", "Output directory for <Name>.framework") { |v| options[:output_dir] = v }
    o.on("--no-x86_64", "Emit arm64-only simulator slice (Option A)") { options[:keep_x86_64] = false }
    o.on("--dry-run", "Print actions without changing anything") { options[:dry_run] = true }
    o.on("-v", "--verbose", "Print each command") { options[:verbose] = true }
    o.on("--force", "Ignore the idempotency sentinel") { options[:force] = true }
    o.on("-h", "--help", "Show this help") { puts o; exit 0 }
  end
  parser.parse!(ARGV)

  if ARGV.length != 1
    warn parser.help
    exit 2
  end

  begin
    result = Transmogrify::Converter.new(ARGV[0], **options).convert!
    puts result ? "[rnmlkit-arm64sim] OK: #{result}" : "[rnmlkit-arm64sim] OK: nothing to do"
    exit 0
  rescue Transmogrify::LayoutError => e
    warn "[rnmlkit-arm64sim] LAYOUT ERROR: #{e.message}"
    exit 1
  rescue Transmogrify::ToolError => e
    warn "[rnmlkit-arm64sim] TOOL ERROR: #{e.message}"
    exit 2
  end
end
