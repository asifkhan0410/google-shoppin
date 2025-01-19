import React, { useState, useRef, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";
import { Camera, CameraView } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { setStatusBarHidden } from "expo-status-bar";
import { Link, router } from "expo-router";

const { width: screenWidth } = Dimensions.get("window");

const LensSearch = () => {
  const [type, setType] = useState(ImagePicker.CameraType.back);
  const [hasPermission, setHasPermission] = useState(false);
  const [flash, setFlash] = useState("off");
  const [zoom, setZoom] = useState(0);
  const [cameraReady, setCameraReady] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const fetchCameraPermission = async () => {
    const getPermission = await Camera.getCameraPermissionsAsync();
    if (getPermission.granted) {
      return true;
    } else {
      const { status } = await Camera.requestCameraPermissionsAsync();
      return status === "granted";
    }
  };

  useEffect(() => {
    setStatusBarHidden(true);
    fetchCameraPermission().then((res) => setHasPermission(res));

    return () => setStatusBarHidden(false);
  }, []);

  if (!hasPermission) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          We need your permission to show the camera
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={fetchCameraPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const toggleCameraType = () => {
    setType((current) =>
      current === ImagePicker.CameraType.back
        ? ImagePicker.CameraType.front
        : ImagePicker.CameraType.back
    );
  };

  const toggleFlash = () => {
    setFlash((current) => (current === "off" ? "on" : "off"));
  };

  const handleZoomIn = () => {
    setZoom((current) => Math.min(current + 0.1, 1));
  };

  const handleZoomOut = () => {
    setZoom((current) => Math.max(current - 0.1, 0));
  };

  const takePicture = async () => {
    if (!cameraReady) return;

    try {
      const photo = await cameraRef.current!.takePictureAsync({
        quality: 1,
        base64: true,
        exif: true,
      });
      if(photo){
        router.push("/search-results");
        router.setParams({ imageUri: photo!.uri });
      }else{
        return Error("Error taking picture");
      }
    } catch (error) {
      console.log("Error taking picture:", error);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        router.push("/search-results");
        router.setParams({ imageUri: result.assets[0].uri });
      }
    } catch (error) {
      console.log("Error picking image:", error);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        // type={type}
        // flashMode={flash}
        zoom={zoom}
        onCameraReady={() => setCameraReady(true)}
      >
        <View style={styles.topControls}>
          <Link href="/">
            <View style={styles.backButton}>
              <MaterialIcons name="arrow-back" size={24} color="white" />
            </View>
          </Link>

          <View style={styles.cameraControls}>
            <TouchableOpacity
              style={styles.controlButton}
              onPress={toggleFlash}
            >
              <MaterialIcons
                name={flash === "off" ? "flash-off" : "flash-on"}
                size={24}
                color="white"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={toggleCameraType}
            >
              <MaterialIcons name="flip-camera-ios" size={24} color="white" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlButton}
              onPress={handleZoomIn}
            >
              <MaterialIcons name="zoom-in" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Camera grid overlay */}
        {/* <View style={styles.gridOverlay}>
          <View style={styles.gridRow}>
            <View style={styles.gridLine} />
            <View style={styles.gridLine} />
          </View>
          <View style={styles.gridCol}>
            <View style={styles.gridLine} />
            <View style={styles.gridLine} />
          </View>
        </View> */}

        <View style={styles.bottomControls}>
          <TouchableOpacity style={styles.galleryButton} onPress={pickImage}>
            <MaterialIcons name="photo-library" size={30} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.captureButton}
            onPress={takePicture}
            disabled={!cameraReady}
          >
            <View
              style={[
                styles.captureButtonInner,
                !cameraReady && styles.captureButtonDisabled,
              ]}
            />
          </TouchableOpacity>

          <View style={styles.placeholderButton} />
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
    justifyContent: "space-between",
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: "#202124",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  permissionText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  permissionButton: {
    backgroundColor: "#8AB4F8",
    padding: 15,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: "#202124",
    fontSize: 16,
    fontWeight: "600",
  },
  topControls: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
    paddingTop: 50,
  },
  backButton: {
    padding: 8,
  },
  cameraControls: {
    flexDirection: "row",
    gap: 20,
  },
  controlButton: {
    padding: 8,
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  gridRow: {
    width: "100%",
    height: screenWidth,
    justifyContent: "space-around",
    position: "absolute",
  },
  gridCol: {
    width: screenWidth,
    height: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
    position: "absolute",
  },
  gridLine: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: "rgba(255, 255, 255, 0.3)",
    margin: screenWidth / 3,
  },
  bottomControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 20,
    paddingBottom: 40,
  },
  galleryButton: {
    padding: 12,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "transparent",
    borderWidth: 4,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "white",
  },
  captureButtonDisabled: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  placeholderButton: {
    width: 54,
    height: 54,
  },
});

export default LensSearch;
