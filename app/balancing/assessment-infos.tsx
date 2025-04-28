import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useForm } from "~/lib/formContext";
import { KeyboardAvoidingView, Platform } from "react-native";

const MassAndVibrationForm = () => {
  const { updateFormData } = useForm();
  const [test1, setTest1] = useState({
    weight: "",
    angle: "",
    correctionWeight: "",
    correctionAngle: "",
  });

  const [test2, setTest2] = useState({
    weight: "",
    angle: "",
    correctionWeight: "",
    correctionAngle: "",
  });

  const [vibration, setVibration] = useState({
    initial1: "",
    final1: "",
    initial2: "",
    final2: "",
  });

  const calculateImprovement = (initial: string, final: string) => {
    const i = parseFloat(initial.replace(",", "."));
    const f = parseFloat(final.replace(",", "."));
    if (!isNaN(i) && !isNaN(f) && i > 0) {
      const improvement = ((i - f) / i) * 100;
      return improvement.toFixed(1).replace(".", ",") + "%";
    }
    return "";
  };

  const handleNext = () => {
    if (!isFormComplete()) {
      alert("Por favor, preencha todos os campos antes de continuar.");
      return;
    }

    updateFormData({
      massCorrection: {
        test1,
        test2,
      },
      vibration: {
        ...vibration,
        result1: calculateImprovement(vibration.initial1, vibration.final1),
        result2: calculateImprovement(vibration.initial2, vibration.final2),
      },
    });

    router.push("/balancing/photo-info");
  };

  const isFormComplete = () => {
    // Teste 1 massa
    const test1Complete =
      test1.weight.trim() !== "" &&
      test1.angle.trim() !== "" &&
      test1.correctionWeight.trim() !== "" &&
      test1.correctionAngle.trim() !== "";

    // Vibração teste 1 (obrigatório)
    const vibration1Complete =
      vibration.initial1.trim() !== "" && vibration.final1.trim() !== "";

    // Teste 2 massa (se preencher algum campo, obrigar a preencher todos)
    const test2SomeFieldFilled =
      test2.weight.trim() !== "" ||
      test2.angle.trim() !== "" ||
      test2.correctionWeight.trim() !== "" ||
      test2.correctionAngle.trim() !== "";

    const test2Complete =
      !test2SomeFieldFilled ||
      (test2.weight.trim() !== "" &&
        test2.angle.trim() !== "" &&
        test2.correctionWeight.trim() !== "" &&
        test2.correctionAngle.trim() !== "");

    // Vibração teste 2 (se preencher algum campo, obrigar a preencher os dois)
    const vibration2SomeFieldFilled =
      vibration.initial2.trim() !== "" || vibration.final2.trim() !== "";

    const vibration2Complete =
      !vibration2SomeFieldFilled ||
      (vibration.initial2.trim() !== "" && vibration.final2.trim() !== "");

    return (
      test1Complete && vibration1Complete && test2Complete && vibration2Complete
    );
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView
        className="p-4 bg-gray-100"
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-3xl font-bold text-center mb-1">Preventix</Text>
        <Text className="text-lg text-center mb-10 font-semibold">
          Balanceamento
        </Text>
        {/* MASSA TESTE 1 */}
        <Text className="bg-[#0D0D1B] text-white text-center py-2 rounded mb-2">
          Massa Teste 1
        </Text>
        <View className="gap-2 mb-4">
          <Text className="font-semibold">Peso Teste 1</Text>
          <View className="flex-row gap-2">
            <TextInput
              placeholder="Peso (g)"
              value={test1.weight}
              onChangeText={(v) => setTest1({ ...test1, weight: v })}
              className="flex-1 bg-white p-3 rounded"
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Ângulo (°)"
              value={test1.angle}
              onChangeText={(v) => setTest1({ ...test1, angle: v })}
              className="flex-1 bg-white p-3 rounded"
              keyboardType="numeric"
            />
          </View>

          <Text className="font-semibold mt-2">Massa de Correção 1</Text>
          <View className="flex-row gap-2">
            <TextInput
              placeholder="Peso (g)"
              value={test1.correctionWeight}
              onChangeText={(v) => setTest1({ ...test1, correctionWeight: v })}
              className="flex-1 bg-white p-3 rounded"
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Ângulo (°)"
              value={test1.correctionAngle}
              onChangeText={(v) => setTest1({ ...test1, correctionAngle: v })}
              className="flex-1 bg-white p-3 rounded"
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* MASSA TESTE 2 */}
        <Text className="bg-[#0D0D1B] text-white text-center py-2 rounded mb-2">
          Massa Teste 2
        </Text>
        <View className="gap-2 mb-4">
          <Text className="font-semibold">Peso Teste 2</Text>
          <View className="flex-row gap-2">
            <TextInput
              placeholder="Peso (g)"
              value={test2.weight}
              onChangeText={(v) => setTest2({ ...test2, weight: v })}
              className="flex-1 bg-white p-3 rounded"
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Ângulo (°)"
              value={test2.angle}
              onChangeText={(v) => setTest2({ ...test2, angle: v })}
              className="flex-1 bg-white p-3 rounded"
              keyboardType="numeric"
            />
          </View>

          <Text className="font-semibold mt-2">Massa de Correção 2</Text>
          <View className="flex-row gap-2">
            <TextInput
              placeholder="Peso (g)"
              value={test2.correctionWeight}
              onChangeText={(v) => setTest2({ ...test2, correctionWeight: v })}
              className="flex-1 bg-white p-3 rounded"
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Ângulo (°)"
              value={test2.correctionAngle}
              onChangeText={(v) => setTest2({ ...test2, correctionAngle: v })}
              className="flex-1 bg-white p-3 rounded"
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* VIBRAÇÃO */}
        <Text className="bg-[#0D0D1B] text-white text-center py-2 rounded mb-2">
          Vibração
        </Text>
        <View className="gap-2 mb-6">
          <Text className="font-semibold">Teste 1</Text>
          <View className="flex-row gap-2 mb-2">
            <TextInput
              placeholder="Inicial (mm/s)"
              value={vibration.initial1}
              onChangeText={(v) => setVibration({ ...vibration, initial1: v })}
              className="flex-1 bg-white p-3 rounded"
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Final (mm/s)"
              value={vibration.final1}
              onChangeText={(v) => setVibration({ ...vibration, final1: v })}
              className="flex-1 bg-white p-3 rounded"
              keyboardType="numeric"
            />
          </View>
          <View className="bg-white p-3 rounded shadow-sm mt-1">
            <Text className="text-base font-semibold text-gray-800">
              Resultado:{" "}
              {calculateImprovement(vibration.initial1, vibration.final1)}
            </Text>
          </View>

          <Text className="font-semibold mt-4">Teste 2</Text>
          <View className="flex-row gap-2 mb-2">
            <TextInput
              placeholder="Inicial (mm/s)"
              value={vibration.initial2}
              onChangeText={(v) => setVibration({ ...vibration, initial2: v })}
              className="flex-1 bg-white p-3 rounded"
              keyboardType="numeric"
            />
            <TextInput
              placeholder="Final (mm/s)"
              value={vibration.final2}
              onChangeText={(v) => setVibration({ ...vibration, final2: v })}
              className="flex-1 bg-white p-3 rounded"
              keyboardType="numeric"
            />
          </View>
          <View className="bg-white p-3 rounded shadow-sm mt-1">
            <Text className="text-base font-semibold text-gray-800">
              Resultado:{" "}
              {calculateImprovement(vibration.initial2, vibration.final2)}
            </Text>
          </View>
        </View>

        {/* BOTÕES */}
        <View className="flex-row gap-4 mt-8 mb-14">
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
            className={`flex-1 py-4 rounded ${
              isFormComplete() ? "bg-yellow-600" : "bg-gray-400"
            }`}
            disabled={!isFormComplete()}
          >
            <Text className="text-center text-white font-semibold text-base">
              Próximo →
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default MassAndVibrationForm;
