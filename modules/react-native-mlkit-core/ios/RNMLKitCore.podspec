require 'json'

package = JSON.parse(File.read(File.join(__dir__, '..', 'package.json')))

Pod::Spec.new do |s|
  s.name           = 'RNMLKitCore'
  s.version        = package['version']
  s.summary        = package['description']
  s.description    = package['description']
  s.license        = package['license']
  s.author         = package['author']
  s.homepage       = package['homepage']
  s.platform       = :ios, '15.1'
  s.swift_version  = '5.4'
  s.source         = { git: 'http://github.com/infinitered/react-native-mlkit' }
  s.static_framework = true

  s.dependency 'MLKitVision'
  s.dependency 'ExpoModulesCore'

  # Swift/Objective-C compatibility
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }

  def s.build_type
    Pod::BuildType.static_library
  end

  s.source_files = "**/*.{h,m,swift}"
end
