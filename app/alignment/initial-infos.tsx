import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import { useForm } from "~/lib/context";

export default function GeneralInfoScreen() {
  const router = useRouter();
  const { updateFormData } = useForm();

  const [machineId, setMachineId] = useState("");
  const [company, setCompany] = useState("");
  const [date, setDate] = useState("");
  const [operator, setOperator] = useState("");
  const [notes, setNotes] = useState("");
  const [speed, setSpeed] = useState("");
  const [deviation, setDeviation] = useState("");
  const [angularError, setAngularError] = useState("");

  const handleNext = () => {
    if (
      !machineId ||
      !company ||
      !date ||
      !operator ||
      !notes ||
      !speed ||
      !deviation ||
      !angularError
    ) {
      Alert.alert("Erro", "Preencha todos os campos antes de continuar.");
      return;
    }

    updateFormData({
      generalInfo: {
        machineId,
        company,
        date,
        operator,
        notes,
        speed,
        deviation,
        angularError,
      },
    });

    router.push("/alignment/assessment-infos");
  };

  const handleDateChange = (text: string) => {
    const cleaned = text.replace(/\D/g, ""); // remove não-dígitos
    let masked = "";
  
    if (cleaned.length <= 2) {
      masked = cleaned;
    } else if (cleaned.length <= 4) {
      masked = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    } else {
      masked = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
    }
  
    setDate(masked);
  };
  

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 40 }}
          keyboardShouldPersistTaps="handled"
          className="bg-gray-200"
        >
          <Text className="text-3xl font-bold text-center mb-10">Preventix</Text>

          <Text className="bg-black text-white text-center py-2 rounded mb-4">
            Informações gerais
          </Text>

          <View className="flex-row gap-4 mb-4">
            <TextInput
              value={machineId}
              onChangeText={setMachineId}
              placeholder="ID da máquina"
              className="flex-1 bg-white px-4 py-3 rounded"
            />
            <TextInput
              value={company}
              onChangeText={setCompany}
              placeholder="Empresa"
              className="flex-1 bg-white px-4 py-3 rounded"
            />
          </View>

          <TextInput
            value={date}
            onChangeText={handleDateChange}
            placeholder="Data (00/00/0000)"
            className="bg-white px-4 py-3 rounded mb-4"
          />

          <TextInput
            value={operator}
            onChangeText={setOperator}
            placeholder="Operador"
            className="bg-white px-4 py-3 rounded mb-4"
          />

          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Notas"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            className="bg-white px-4 py-3 rounded mb-6"
          />

          <Text className="bg-black text-white text-center py-2 rounded mb-4">
            Tolerâncias
          </Text>

          <TextInput
            value={speed}
            onChangeText={setSpeed}
            placeholder="Velocidade (rpm)"
            className="bg-white px-4 py-3 rounded mb-4"
            keyboardType="numeric"
          />
          <TextInput
            value={deviation}
            onChangeText={setDeviation}
            placeholder="Desvio (mm)"
            className="bg-white px-4 py-3 rounded mb-4"
            keyboardType="numeric"
          />
          <TextInput
            value={angularError}
            onChangeText={setAngularError}
            placeholder="Erro angular (mm/100)"
            className="bg-white px-4 py-3 rounded mb-6"
            keyboardType="numeric"
          />

          <TouchableOpacity
            onPress={handleNext}
            className="bg-yellow-600 py-4 rounded"
          >
            <Text className="text-center text-white font-semibold text-base">
              Ir para avaliação →
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
