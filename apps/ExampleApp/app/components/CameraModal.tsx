import React, { useRef, useState } from "react"
import {
  Modal,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { CameraView, useCameraPermissions, CameraType } from "expo-camera"
import { Text } from "./Text"
import { Button } from "./Button"
import { colors, spacing } from "../theme"

interface CameraModalProps {
  visible: boolean
  onCapture: (uri: string) => void
  onClose: () => void
}

export function CameraModal({ visible, onCapture, onClose }: CameraModalProps) {
  const cameraRef = useRef<CameraView>(null)
  const [permission, requestPermission] = useCameraPermissions()
  const [isCapturing, setIsCapturing] = useState(false)
  const [facing, setFacing] = useState<CameraType>("back")
  const insets = useSafeAreaInsets()

  const toggleFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"))
  }

  const handleCapture = async () => {
    if (!cameraRef.current || isCapturing) return

    setIsCapturing(true)
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.5,
      })
      if (photo?.uri) {
        onCapture(photo.uri)
      }
    } catch (error) {
      console.error("Error capturing photo:", error)
    } finally {
      setIsCapturing(false)
    }
  }

  if (!permission) {
    return null
  }

  if (!permission.granted) {
    return (
      <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
        <View style={[$container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
          <View style={$permissionContainer}>
            <Text style={$permissionText}>Camera permission is required to take photos.</Text>
            <Button
              text="Grant Permission"
              preset="reversed"
              onPress={requestPermission}
              style={$permissionButton}
            />
            <Button
              text="Cancel"
              preset="default"
              onPress={onClose}
              style={$cancelButton}
              textStyle={$cancelButtonText}
            />
          </View>
        </View>
      </Modal>
    )
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={$container}>
        <CameraView ref={cameraRef} style={$camera} facing={facing}>
          <View style={[$overlay, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <View style={$topBar}>
              <TouchableOpacity style={$closeButton} onPress={onClose}>
                <Text style={$closeButtonText}>✕</Text>
              </TouchableOpacity>
              <TouchableOpacity style={$flipButton} onPress={toggleFacing}>
                <Text style={$flipButtonText}>⟲</Text>
              </TouchableOpacity>
            </View>
            <View style={$bottomBar}>
              <TouchableOpacity
                style={[$captureButton, isCapturing && $captureButtonDisabled]}
                onPress={handleCapture}
                disabled={isCapturing}
              >
                {isCapturing ? (
                  <ActivityIndicator color={colors.palette.neutral900} />
                ) : (
                  <View style={$captureButtonInner} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </View>
    </Modal>
  )
}

const $container: ViewStyle = {
  flex: 1,
  backgroundColor: colors.palette.neutral900,
}

const $camera: ViewStyle = {
  flex: 1,
}

const $overlay: ViewStyle = {
  flex: 1,
  justifyContent: "space-between",
}

const $topBar: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  padding: spacing.md,
}

const $flipButton: ViewStyle = {
  width: 44,
  height: 44,
  borderRadius: 22,
  backgroundColor: colors.palette.overlay50,
  justifyContent: "center",
  alignItems: "center",
  paddingBottom: 8,
  paddingRight: 2,
}

const $flipButtonText: TextStyle = {
  color: colors.palette.neutral100,
  fontSize: 28,
  textAlign: "center",
  // marginTop: -8,
  alignItems: "center",
  alignSelf: "center",
}

const $closeButton: ViewStyle = {
  width: 44,
  height: 44,
  borderRadius: 22,
  backgroundColor: colors.palette.overlay50,
  justifyContent: "center",
  alignItems: "center",
}

const $closeButtonText: TextStyle = {
  color: colors.palette.neutral100,
  fontSize: 20,
  fontWeight: "bold",
}

const $bottomBar: ViewStyle = {
  flexDirection: "row",
  justifyContent: "center",
  paddingBottom: 40,
}

const $captureButton: ViewStyle = {
  width: 80,
  height: 80,
  borderRadius: 40,
  backgroundColor: colors.palette.neutral100,
  justifyContent: "center",
  alignItems: "center",
  borderWidth: 4,
  borderColor: "rgba(255,255,255,0.5)",
}

const $captureButtonDisabled: ViewStyle = {
  opacity: 0.7,
}

const $captureButtonInner: ViewStyle = {
  width: 60,
  height: 60,
  borderRadius: 30,
  backgroundColor: colors.palette.neutral100,
}

const $permissionContainer: ViewStyle = {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  padding: spacing.lg,
}

const $permissionText: TextStyle = {
  fontSize: 16,
  textAlign: "center",
  marginBottom: spacing.lg,
  color: colors.palette.neutral100,
}

const $permissionButton: ViewStyle = {
  minWidth: 200,
  marginBottom: spacing.sm,
}

const $cancelButton: ViewStyle = {
  minWidth: 200,
  backgroundColor: colors.transparent,
  borderColor: colors.palette.neutral100,
}

const $cancelButtonText: TextStyle = {
  color: colors.palette.neutral100,
}
