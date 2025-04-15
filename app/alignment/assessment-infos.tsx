import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import { useForm } from "~/lib/formContext";

export default function AssessmentInfosScreen() {
  const router = useRouter();
  const { updateFormData } = useForm();

  const fieldLabels: Record<keyof typeof found, string> = {
    deviation: "Desvio",
    angle: "Ângulo",
    frontFoot: "Pé frontal",
    rearFoot: "Pé traseiro",
  };

  const createPairState = () => ({
    vertical: "",
    horizontal: "",
  });

  const [found, setFound] = useState({
    deviation: createPairState(),
    angle: createPairState(),
    frontFoot: createPairState(),
    rearFoot: createPairState(),
  });

  const [corrected, setCorrected] = useState({
    deviation: createPairState(),
    angle: createPairState(),
    frontFoot: createPairState(),
    rearFoot: createPairState(),
  });

  const handleInputChange = (
    type: "found" | "corrected",
    field: keyof typeof found,
    axis: "vertical" | "horizontal",
    value: string
  ) => {
    const setter = type === "found" ? setFound : setCorrected;
    const state = type === "found" ? found : corrected;

    setter({
      ...state,
      [field]: {
        ...state[field],
        [axis]: value,
      },
    });
  };

  const handleNext = () => {
    updateFormData({
      alignmentInfo: {
        found,
        corrected,
      },
    });

    router.push("/alignment/photo-info");
  };

  const renderSection = (label: string, type: "found" | "corrected") => {
    const data = type === "found" ? found : corrected;

    return (
      <>
        <Text className="bg-black text-white text-center py-2 rounded mb-4">
          {label}
        </Text>

        {Object.entries(data).map(([key, value]) => (
          <View key={key} className="mb-4">
            <Text className="text-sm mb-1 capitalize">
              {fieldLabels[key as keyof typeof found]}
            </Text>
            <View className="flex-row gap-4">
              <TextInput
                placeholder="Vertical"
                value={value.vertical}
                onChangeText={(text) =>
                  handleInputChange(
                    type,
                    key as keyof typeof found,
                    "vertical",
                    text
                  )
                }
                className="flex-1 bg-white px-4 py-3 rounded"
                keyboardType="numeric"
              />
              <TextInput
                placeholder="Horizontal"
                value={value.horizontal}
                onChangeText={(text) =>
                  handleInputChange(
                    type,
                    key as keyof typeof found,
                    "horizontal",
                    text
                  )
                }
                className="flex-1 bg-white px-4 py-3 rounded"
                keyboardType="numeric"
              />
            </View>
          </View>
        ))}
      </>
    );
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          className="flex-1 bg-gray-200 px-6 py-10"
          keyboardShouldPersistTaps="handled"
        >
          <Text className="text-3xl font-bold text-center mb-10">
            Preventix
          </Text>

          {renderSection("Conforme encontrado", "found")}
          {renderSection("Conforme corrigido", "corrected")}

          <View className="flex-row gap-4 mt-8 mb-8">
            <TouchableOpacity
              onPress={() => router.back()}
              className="flex-1 bg-yellow-600 py-4 rounded"
            >
              <Text className="text-center text-white font-semibold text-base">
                ← Voltar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleNext}
              className="flex-1 bg-yellow-600 py-4 rounded"
            >
              <Text className="text-center text-white font-semibold text-base">
                Próximo →
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
