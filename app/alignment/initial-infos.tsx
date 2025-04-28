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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "~/components/ui/select";

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
  const { user }: any = useAuth(); // Pegando os dados do usuário do contexto

  // Inicializa com o nome do operador se disponível, caso contrário, vazio
  const [operator, setOperator] = useState(user?.name || "");

  const [machineId, setMachineId] = useState("");
  const [company, setCompany] = useState("");
  const [date, setDate] = useState(getTodayFormatted());
  const [notes, setNotes] = useState("");
  const [speed, setSpeed] = useState("");
  const [deviation, setDeviation] = useState("");
  const [angularError, setAngularError] = useState("");

  const rpmOptions = [
    {
      label: "0 - 1000",
      value: "0 - 1000",
      deviation: "0.13 mm",
      angularError: "0.10 mm/100",
    },
    {
      label: "1000 - 2000",
      value: "1000 - 2000",
      deviation: "0.10 mm",
      angularError: "0.08 mm/100",
    },
    {
      label: "2000 - 3000",
      value: "2000 - 3000",
      deviation: "0.07 mm",
      angularError: "0.07 mm/100",
    },
    {
      label: "3000 - 4000",
      value: "3000 - 4000",
      deviation: "0.05 mm",
      angularError: "0.06 mm/100",
    },
    {
      label: "4000 - 6000",
      value: "4000 - 6000",
      deviation: "0.03 mm",
      angularError: "0.05 mm/100",
    },
  ];

  const handleSpeedChange = (value: string) => {
    setSpeed(value);
    const selected = rpmOptions.find((opt) => opt.label === value);
    if (selected) {
      setDeviation(selected.deviation);
      setAngularError(selected.angularError);
    }
  };

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
          <Text className="text-3xl font-bold text-center mb-10">
            Preventix
          </Text>

          <Text className="bg-[#0D0D1B] text-white text-center py-2 rounded mb-4">
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
            placeholder={user?.name ? `Operador: ${user.name}` : "Operador"}
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

          <Text className="bg-[#0D0D1B] text-white text-center py-2 rounded mb-4">
            Tolerâncias
          </Text>

          <Select
            value={rpmOptions.find((opt) => opt.value === speed)}
            onValueChange={(option) => {
              if (option) {
                handleSpeedChange(option.value);
              }
            }}
          >
            <SelectTrigger className="w-full bg-white rounded-md px-4 py-3 mb-4">
              <SelectValue
                placeholder="Selecione a faixa de rotação (RPM)"
                className="text-foreground text-base"
              />
            </SelectTrigger>
            <SelectContent className="w-full max-w-sm">
              <SelectGroup>
                <SelectLabel>Faixas de RPM</SelectLabel>
                {rpmOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    label={option.label}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <TextInput
            value={deviation}
            placeholder="Desvio (mm)"
            editable={false}
            className="bg-white px-4 py-3 rounded mb-4"
          />
          <TextInput
            value={angularError}
            placeholder="Erro angular (mm/100)"
            editable={false}
            className="bg-white px-4 py-3 rounded mb-6"
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
