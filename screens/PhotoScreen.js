import React, { useState } from "react";
import { View, Text, Button, StyleSheet, Image, Alert } from "react-native";
import {
  launchImageLibraryAsync,
  launchCameraAsync,
  MediaTypeOptions,
  useCameraPermissions,
} from "expo-image-picker";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";

const imageOptions = {
  mediaTypes: MediaTypeOptions.Images,
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.8,
};

function PhotoScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  const pickImageHandler = async () => {
    const result = await launchImageLibraryAsync(imageOptions);
    if (!result.canceled) setImage(result.assets[0].uri);
  };

  const takeImageHandler = async () => {
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
    data.append("upload_preset", "bookingApp"); // Ensure the upload preset is a string
    data.append("cloud_name", "dfedcek1j");

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dfedcek1j/image/upload`,
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

  const confirmImageHandler = async () => {
    if (image) {
      const photoUrl = await uploadToCloudinary(image);
      if (photoUrl) {
        Alert.alert("Photo Uploaded", "Photo was successfully uploaded.");
        navigation.navigate("Account", {
          dog: photoUrl, // You can replace 'dog' with your actual object key
        });
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
        {/* Ensure the title prop is a string */}
        <Button title="Take a Photo" onPress={takeImageHandler} />
        {/* Ensure the title prop is a string */}
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
      {/* Ensure the title prop is a string */}
    </View>
  );
}

export default PhotoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
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
