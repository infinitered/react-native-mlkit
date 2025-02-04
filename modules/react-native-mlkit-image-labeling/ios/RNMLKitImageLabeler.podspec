require 'json'

package = JSON.parse(File.read(File.join(__dir__, '..', 'package.json')))

Pod::Spec.new do |s|
  s.name           = 'RNMLKitImageLabeler'
  s.version        = package['version']
  s.summary        = package['description']
  s.description    = package['description']
  s.license        = package['license']
  s.author         = package['author']
  s.homepage       = package['homepage']
  s.platform       = :ios, '15.8.3'
  s.swift_version  = '5.4'
  s.source         = { git: 'https://github.com/infinitered/react-native-mlkit' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'
  s.dependency 'RNMLKitCore'
  s.dependency 'MLKitImageLabeling'
  s.dependency 'GoogleMLKit/ImageLabelingCustom'


  # Swift/Objective-C compatibility
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }

  s.source_files = "**/*.{h,m,swift}"
end
