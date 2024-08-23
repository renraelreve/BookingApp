import { CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_CLOUD_NAME } from "@env";
import React, { useState } from "react";
import { View, Text, Button, StyleSheet, Image, Alert } from "react-native";
import {
  launchImageLibraryAsync,
  launchCameraAsync,
  MediaTypeOptions,
  useCameraPermissions,
} from "expo-image-picker";
import axios from "axios";
import base64 from "react-native-base64";
import { useNavigation } from "@react-navigation/native";
import { bookingApi } from "../api/bookingApi";

const imageOptions = {
  mediaTypes: MediaTypeOptions.Images,
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.8,
};

function PhotoScreen({ route, navigation }) {
  const { event } = route.params;
  const [image, setImage] = useState(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  const pickImageHandler = async () => {
    const result = await launchImageLibraryAsync(imageOptions);
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const takeImageHandler = async () => {
    if (!cameraPermission.granted) {
      const permissionResponse = await requestCameraPermission();
      if (!permissionResponse.granted) {
        Alert.alert(
          "Insufficient permissions!",
          "You need to grant camera permissions to use this feature."
        );
        return;
      }
    }

    const result = await launchCameraAsync(imageOptions);
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const uploadToCloudinary = async (imageUri) => {
    const data = new FormData();
    data.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: "photo.jpg",
    });
    data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    data.append("cloud_name", CLOUDINARY_CLOUD_NAME);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Cloudinary response:", response.data); // Debugging line
      return response.data.secure_url; // The URL of the uploaded image
    } catch (error) {
      console.error(
        "Error uploading to Cloudinary",
        error.response?.data || error.message
      );
      Alert.alert("Upload failed", "Could not upload photo to Cloudinary.");
    }
  };

  const userId = 1;

  const username = "Abigail";
  const password = "password123";
  const token = base64.encode(`${username}:${password}`);

  const confirmImageHandler = async () => {
    if (image) {
      try {
        const photoUrl = await uploadToCloudinary(image);
        if (photoUrl) {
          try {
            // POST the photo URL to the backend
            const response = await bookingApi.post(
              `/api/event/${event.eid}/cloudimage`,
              {
                url: photoUrl,
              },
              {
                headers: {
                  Authorization: `Basic ${token}`,
                },
              }
            );

            if (response.status === 201) {
              Alert.alert(
                "Photo Uploaded",
                "Photo was successfully uploaded and saved."
              );
              navigation.navigate("Detail", { event }); // Navigate back
            } else {
              Alert.alert(
                "Upload Failed",
                "The photo was uploaded but could not be saved."
              );
            }
          } catch (error) {
            console.error(
              "Error saving photo to backend",
              error.response?.data || error.message
            );
            Alert.alert("Error", "Could not save the photo to the backend.");
          }
        } else {
          Alert.alert("Upload Failed", "Could not get the photo URL.");
        }
      } catch (error) {
        console.error("Error uploading photo", error.message);
        Alert.alert("Upload Failed", "Could not upload photo to Cloudinary.");
      }
    } else {
      Alert.alert("No Photo", "Please select or take a photo first.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instructionText}>
        Choose an existing photo or take a new photo.
      </Text>
      <View style={styles.buttonsContainer}>
        <Button title="Pick a Photo" onPress={pickImageHandler} />
        <Button title="Take a Photo" onPress={takeImageHandler} />
      </View>
      {!image && (
        <Text style={styles.instructionText}>No photo selected yet.</Text>
      )}
      {image && (
        <View>
          <Text style={styles.instructionText}>Preview</Text>
          <Image style={styles.previewImage} source={{ uri: image }} />
        </View>
      )}
      <Button title="Save" onPress={confirmImageHandler} />
    </View>
  );
}

export default PhotoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#DCEEF9",
    alignItems: "center",
    padding: 10,
  },
  instructionText: {
    fontFamily: "Rubik_400Regular",
    textAlign: "center",
    paddingVertical: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  previewImage: {
    width: 200,
    height: 200,
    marginVertical: 10,
  },
});
