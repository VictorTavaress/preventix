import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function PhotoInfoScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("Sem arquivo");
  const router = useRouter();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const selectedAsset = result.assets[0];
      setImage(selectedAsset.uri);
      setFileName(selectedAsset.fileName ?? "Imagem selecionada");
    }
  };

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (permission.granted) {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled) {
        const capturedAsset = result.assets[0];
        setImage(capturedAsset.uri);
        setFileName(capturedAsset.fileName ?? "Foto capturada");
      }
    } else {
      alert("Permissão de câmera negada.");
    }
  };

  const removeImage = () => {
    setImage(null);
    setFileName("Sem arquivo");
  };

  return (
    <View className="flex-1 bg-gray-200 px-6 py-10">
      <Text className="text-3xl font-bold text-center mb-10">Preventix</Text>

      <Text className="bg-black text-white text-center py-2 rounded mb-4">
        Foto da máquina
      </Text>

      {!image ? (
        <>
          <TouchableOpacity
            onPress={pickImage}
            className="bg-white px-4 py-3 rounded mb-4 flex-row justify-between items-center"
          >
            <Text className="text-black">Escolher arquivo</Text>
            <Text className="text-gray-500">{fileName}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={takePhoto}
            className="bg-black py-4 rounded mb-4 flex-row justify-center items-center"
          >
            <Ionicons name="camera-outline" size={20} color="white" />
            <Text className="text-white ml-2 font-semibold">Tirar foto</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Image
            source={{ uri: image }}
            className="w-full h-72 rounded mb-4"
            resizeMode="cover"
          />

          <TouchableOpacity
            onPress={removeImage}
            className="bg-red-500 py-4 rounded mb-4"
          >
            <Text className="text-center text-white font-semibold">
              Remover imagem
            </Text>
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
