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
import { useForm } from "../../lib/formContext";
import * as ImageManipulator from "expo-image-manipulator";

export default function PhotoBalanceScreen() {
  const [images, setImages] = useState<string[]>([]);
  const router = useRouter();
  const { updateFormData } = useForm();

  const updateImages = (newImages: string[]) => {
    setImages(newImages);
    updateFormData({ photos: newImages }); // <-- campo específico para balanceamento
  };

  const pickImage = async () => {
    if (images.length >= 5) return;

    const result = await ImagePicker.launchImageLibraryAsync({
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
      const updated = [...images, uri].slice(0, 5);
      updateImages(updated);
    }
  };

  const takePhoto = async () => {
    if (images.length >= 5) return;

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
      const updated = [...images, uri].slice(0, 5);
      updateImages(updated);
    }
  };

  const removeImage = (uriToRemove: string) => {
    const updated = images.filter((uri) => uri !== uriToRemove);
    updateImages(updated);
  };

  return (
    <View className="flex-1 bg-gray-200 px-6 py-10">
      <Text className="text-3xl font-bold text-center mb-10">Preventix</Text>

      <Text className="bg-[#0D0D1B] text-white text-center py-2 rounded mb-4">
        Fotos do Balanceamento ({images.length}/5)
      </Text>

      {images.length > 0 && (
        <View className="mb-6">
          <Text className="mb-2 font-semibold text-base text-gray-800">
            Imagem de Cabeçalho
          </Text>
          <View className="relative">
            <Image
              source={{ uri: images[0] }}
              className="w-full h-48 rounded"
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={() => removeImage(images[0])}
              className="absolute top-2 right-2 bg-red-500 p-1 rounded-full"
            >
              <Ionicons name="close" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {images.length > 1 && (
        <FlatList
          data={images.slice(1)}
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
      )}

      {images.length < 5 && (
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
            className="bg-[#0D0D1B] py-4 rounded mb-4 flex-row justify-center items-center"
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
          onPress={() => router.push("/balancing/review-infos")}
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
