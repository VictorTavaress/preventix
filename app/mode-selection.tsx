import React, { useState } from "react";
import { View, Image, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "~/components/ui/select";

export default function ModeSelectionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedModel, setSelectedModel] = useState<any | undefined>();

  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  const handleUseModel = () => {
    if (!selectedModel) return;
    // redireciona para a home ou outra tela
    // router.push("/");
    if (selectedModel.value === "alinhamento") {
      router.push("/alignment/initial-infos");
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-[#0D0D1B] px-6">
      <Image
        source={require("assets/images/logotipopreventix.png")}
        className="w-52 h-16 mb-12"
        resizeMode="contain"
      />

      <Select
        value={selectedModel}
        onValueChange={(value) => setSelectedModel(value as any)}
      >
        <SelectTrigger className="w-full  bg-white rounded-md px-4 py-3 mb-4">
          <SelectValue
            placeholder="Escolha um modelo"
            className="text-foreground text-base"
          />
        </SelectTrigger>
        <SelectContent insets={contentInsets} className="w-full max-w-sm">
          <SelectGroup>
            <SelectLabel>Modelos</SelectLabel>
            <SelectItem label="Alinhamento" value="alinhamento">
              Alinhamento
            </SelectItem>
            {/* <SelectItem label="Modelo Visualização" value="visualizacao">
              Modelo Visualização
            </SelectItem> */}
          </SelectGroup>
        </SelectContent>
      </Select>

      <TouchableOpacity
        onPress={handleUseModel}
        disabled={!selectedModel}
        className={`w-full  py-3 rounded-md ${
          selectedModel ? "bg-yellow-600" : "bg-yellow-400/50"
        }`}
      >
        <Text className="text-center text-white font-semibold text-base">
          Usar modelo
        </Text>
      </TouchableOpacity>
    </View>
  );
}
