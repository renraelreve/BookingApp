import {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_UPLOAD_PRESET,
} from "@env";

import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, Image, Alert } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Camera } from "expo-camera";
import * as FileSystem from "expo-file-system";
import axios from "axios";

function PhotoScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { event } = route.params;
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [photoUrls, setPhotoUrls] = useState({}); // Initialize with empty object

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const uploadToCloudinary = async (photoUri) => {
    const data = new FormData();
    data.append("file", {
      uri: photoUri,
      type: "image/jpeg",
      name: "photo.jpg",
    });
    data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    data.append("cloud_name", CLOUDINARY_CLOUD_NAME);
    data.append("api_key", CLOUDINARY_API_KEY);
    data.append("api_secret", CLOUDINARY_API_SECRET);

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload",
        data
      );
      return response.data.secure_url; // This is the URL of the uploaded image
    } catch (error) {
      console.error("Error uploading to Cloudinary", error);
      Alert.alert("Upload failed", "Could not upload photo to Cloudinary.");
    }
  };

  const handleTakePhoto = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      const photoUrl = await uploadToCloudinary(photo.uri);
      if (photoUrl) {
        setPhotoUrls((prevState) => ({
          ...prevState,
          [event.eid]: [...(prevState[event.eid] || []), photoUrl],
        }));
        Alert.alert("Photo Uploaded", "Photo was successfully uploaded.");
      }
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.description}>{event.description}</Text>
      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        ref={(ref) => setCameraRef(ref)}
      >
        <View style={styles.buttonContainer}>
          <Button title="Take Photo" onPress={handleTakePhoto} />
          <Button title="Go Back" onPress={() => navigation.goBack()} />
        </View>
      </Camera>
    </View>
  );
}

export default PhotoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  camera: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-end",
  },
  buttonContainer: {
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold", // Optional: Make the text bold
  },
});
