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
import { useForm } from "~/lib/formContext";
import { useAuth } from "~/lib/authContext";

export default function GeneralInfoScreen() {
  const getTodayFormatted = () => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const router = useRouter();
  const { updateFormData } = useForm();
  const { user }: any = useAuth();

  const [date, setDate] = useState(getTodayFormatted());
  const [client, setClient] = useState("");
  const [technician, setTechnician] = useState(user?.name || "");
  const [requester, setRequester] = useState("");
  const [tag, setTag] = useState("");

  const [rotation, setRotation] = useState("");
  const [power, setPower] = useState("");
  const [blades, setBlades] = useState("");
  const [transmissionType, setTransmissionType] = useState(""); // Direta, Polias ou Acoplamento
  const [notes, setNotes] = useState("");

  const handleNext = () => {
    if (!date || !client || !technician || !requester || !tag) {
      Alert.alert("Erro", "Preencha todos os campos antes de continuar.");
      return;
    }

    updateFormData({
      generalInfo: {
        date,
        client,
        technician,
        requester,
        tag,
        rotation,
        power,
        blades,
        transmissionType,
        notes,
      },
    });

    router.push("/balancing/assessment-infos");
  };

  const handleDateChange = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    let masked = "";

    if (cleaned.length <= 2) {
      masked = cleaned;
    } else if (cleaned.length <= 4) {
      masked = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    } else {
      masked = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(
        4,
        8
      )}`;
    }

    setDate(masked);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 40 }}
          keyboardShouldPersistTaps="handled"
          className="bg-gray-200"
        >
          <Text className="text-3xl font-bold text-center mb-1">Preventix</Text>
          <Text className="text-lg text-center mb-10 font-semibold">
            Balanceamento
          </Text>

          <Text className="bg-[#0D0D1B] text-white text-center py-2 rounded mb-4">
            Informações gerais
          </Text>

          <View className="flex-row gap-2 mb-4">
            <TextInput
              value={technician}
              onChangeText={setTechnician}
              placeholder="Técnico"
              className="flex-1 bg-white px-4 py-3 rounded"
            />
            <TextInput
              value={date}
              onChangeText={handleDateChange}
              placeholder="Data (00/00/0000)"
              className="flex-1 bg-white px-4 py-3 rounded"
            />
          </View>

          <TextInput
            value={client}
            onChangeText={setClient}
            placeholder="Cliente / Empresa"
            className="bg-white px-4 py-3 rounded mb-4"
          />

          <TextInput
            value={requester}
            onChangeText={setRequester}
            placeholder="Solicitante"
            className="bg-white px-4 py-3 rounded mb-4"
          />

          <TextInput
            value={tag}
            onChangeText={setTag}
            placeholder="TAG da máquina"
            className="bg-white px-4 py-3 rounded mb-6"
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

          <Text className="bg-[#0D0D1B] text-white text-center py-2 rounded mb-4">
            Dados do Equipamento
          </Text>

          <TextInput
            value={rotation}
            onChangeText={setRotation}
            placeholder="Rotação (RPM)"
            keyboardType="numeric"
            className="bg-white px-4 py-3 rounded mb-4"
          />

          <TextInput
            value={power}
            onChangeText={setPower}
            placeholder="Potência (CV)"
            keyboardType="numeric"
            className="bg-white px-4 py-3 rounded mb-4"
          />

          <TextInput
            value={blades}
            onChangeText={setBlades}
            placeholder="Número de pás"
            keyboardType="numeric"
            className="bg-white px-4 py-3 rounded mb-4"
          />

          <Text className="text-base mb-2">Tipo de Transmissão</Text>

          <View className="flex-row justify-between mb-8">
            {["Direta", "Polias", "Acoplamento"].map((type) => (
              <TouchableOpacity
                key={type}
                onPress={() => setTransmissionType(type)}
                className={`flex-1 mx-1 py-3 rounded ${
                  transmissionType === type ? "bg-yellow-600" : "bg-white"
                }`}
                style={{ borderWidth: 1, borderColor: "#ccc" }}
              >
                <Text
                  className={`text-center font-medium ${
                    transmissionType === type ? "text-white" : "text-black"
                  }`}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            onPress={handleNext}
            className="bg-yellow-600 py-4 rounded mt-4"
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
