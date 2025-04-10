import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useForm } from "../../lib/context";
import * as ImageManipulator from "expo-image-manipulator";

export default function PhotoInfoScreen() {
  const [images, setImages] = useState<string[]>([]);
  const router = useRouter();
  const { formData, updateFormData } = useForm();

  const updateImages = (newImages: string[]) => {
    setImages(newImages);
    updateFormData({
      photos: newImages, // 👈 salva no form
    });
  };

  const pickImage = async () => {
    if (images.length >= 4) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: false, // ❌ NÃO pegar base64 aqui ainda
    });

    if (!result.canceled) {
      const manipulated = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 800 } }], // 👈 Redimensiona
        {
          compress: 0.6,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        }
      );

      const uri = `data:image/jpeg;base64,${manipulated.base64}`;
      const updated = [...images, uri].slice(0, 4);
      updateImages(updated);
    }
  };

  const takePhoto = async () => {
    if (images.length >= 4) return;

    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      return Alert.alert("Permissão de câmera negada.");
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: false,
    });

    if (!result.canceled) {
      const manipulated = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 800 } }],
        {
          compress: 0.6,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: true,
        }
      );

      const uri = `data:image/jpeg;base64,${manipulated.base64}`;
      const updated = [...images, uri].slice(0, 4);
      updateImages(updated);
    }
  };

  const removeImage = (uriToRemove: string) => {
    const updated = images.filter((uri) => uri !== uriToRemove);
    updateImages(updated); // 👈 remove local + form
  };

  const renderImageItem = ({ item }: { item: string }) => (
    <View className="relative w-[48%] mb-4">
      <Image
        source={{ uri: item }}
        className="w-full h-40 rounded"
        resizeMode="cover"
      />
      <TouchableOpacity
        onPress={() => removeImage(item)}
        className="absolute top-2 right-2 bg-red-500 p-1 rounded-full"
      >
        <Ionicons name="close" size={16} color="white" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-200 px-6 py-10">
      <Text className="text-3xl font-bold text-center mb-10">Preventix</Text>

      <Text className="bg-black text-white text-center py-2 rounded mb-4">
        Fotos da máquina ({images.length}/4)
      </Text>

      <FlatList
        data={images}
        numColumns={2}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View className="relative w-[48%] mb-4">
            <Image
              source={{ uri: item }}
              className="w-full h-40 rounded"
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={() => removeImage(item)}
              className="absolute top-2 right-2 bg-red-500 p-1 rounded-full"
            >
              <Ionicons name="close" size={16} color="white" />
            </TouchableOpacity>
          </View>
        )}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ gap: 8 }}
      />

      {images.length < 4 && (
        <>
          <TouchableOpacity
            onPress={pickImage}
            className="bg-white px-4 py-3 rounded mb-4 flex-row justify-between items-center"
          >
            <Text className="text-black">Escolher da galeria</Text>
            <Ionicons name="image-outline" size={20} color="gray" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={takePhoto}
            className="bg-black py-4 rounded mb-4 flex-row justify-center items-center"
          >
            <Ionicons name="camera-outline" size={20} color="white" />
            <Text className="text-white ml-2 font-semibold">Tirar foto</Text>
          </TouchableOpacity>
        </>
      )}

      <View className="flex-row gap-4 mt-auto">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-1 bg-yellow-600 py-4 rounded"
        >
          <Text className="text-center text-white font-semibold text-base">
            ← Voltar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/alignment/review-infos")}
          className="flex-1 bg-yellow-600 py-4 rounded"
        >
          <Text className="text-center text-white font-semibold text-base">
            Revisar →
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
