import React, { useRef, useState } from "react"
import { Modal, View, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { CameraView, useCameraPermissions } from "expo-camera"
import { Text } from "./Text"

interface CameraModalProps {
  visible: boolean
  onCapture: (uri: string) => void
  onClose: () => void
}

export function CameraModal({ visible, onCapture, onClose }: CameraModalProps) {
  const cameraRef = useRef<CameraView>(null)
  const [permission, requestPermission] = useCameraPermissions()
  const [isCapturing, setIsCapturing] = useState(false)
  const insets = useSafeAreaInsets()

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
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
          <View style={styles.permissionContainer}>
            <Text style={styles.permissionText}>
              Camera permission is required to take photos.
            </Text>
            <TouchableOpacity style={styles.button} onPress={requestPermission}>
              <Text style={styles.buttonText}>Grant Permission</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    )
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <CameraView ref={cameraRef} style={styles.camera} facing="back">
          <View
            style={[
              styles.overlay,
              { paddingTop: insets.top, paddingBottom: insets.bottom },
            ]}
          >
            <View style={styles.topBar}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.bottomBar}>
              <TouchableOpacity
                style={[styles.captureButton, isCapturing && styles.captureButtonDisabled]}
                onPress={handleCapture}
                disabled={isCapturing}
              >
                {isCapturing ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <View style={styles.captureButtonInner} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </CameraView>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: "space-between",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "flex-start",
    padding: 16,
  },
  closeButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "center",
    paddingBottom: 40,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.5)",
  },
  captureButtonDisabled: {
    opacity: 0.7,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  permissionText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    color: "#fff",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
  },
})
