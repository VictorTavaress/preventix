import React from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useForm } from "../../lib/context";
import { Ionicons } from "@expo/vector-icons";
import { generatePdf } from "../../lib/utils";
import { alignmentTemplate } from "../../assets/pdf-template/alignment-pdf"; // template em string
import { router } from "expo-router";
import NetInfo from "@react-native-community/netinfo";
import * as FileSystem from "expo-file-system";
import { api } from "../../lib/api"; // onde está seu axios configurado

export default function ReviewInfosScreen() {
  const { formData } = useForm();
  const general = formData.generalInfo || {};
  const found = formData.alignmentInfo?.found || {};
  const corrected = formData.alignmentInfo?.corrected || {};

  async function handleGeneratePDF() {
    const fileName =
      `Alinhamento-${general.company}-${general.operator}.pdf`.replace(
        /\s+/g,
        "_"
      );

    const allPhotos = Array.isArray(formData.photos) ? formData.photos : [];
    const firstImage = allPhotos[0] || "";
    console.log("firstImage", firstImage);
    const remainingImages = allPhotos.slice(1); // ← Apenas array, sem map nem join
    try {
      const { isConnected } = await NetInfo.fetch();

      const filePath = await generatePdf({
        htmlTemplate: alignmentTemplate,
        fileName,
        placeholders: {
          // Informações gerais
          "{{machineId}}": general.machineId || "",
          "{{company}}": general.company || "",
          "{{date}}": general.date || "",
          "{{operator}}": general.operator || "",
          "{{notes}}": general.notes || "",

          // Tolerâncias
          "{{speed}}": general.speed || "",
          "{{deviation}}": general.deviation || "",
          "{{angularError}}": general.angularError || "",

          // Conforme encontrado
          "{{foundDeviationVertical}}": found.deviation?.vertical || "",
          "{{foundDeviationHorizontal}}": found.deviation?.horizontal || "",
          "{{foundAngleVertical}}": found.angle?.vertical || "",
          "{{foundAngleHorizontal}}": found.angle?.horizontal || "",
          "{{foundFrontFootVertical}}": found.frontFoot?.vertical || "",
          "{{foundFrontFootHorizontal}}": found.frontFoot?.horizontal || "",
          "{{foundRearFootVertical}}": found.rearFoot?.vertical || "",
          "{{foundRearFootHorizontal}}": found.rearFoot?.horizontal || "",

          // Conforme corrigido
          "{{correctedDeviationVertical}}": corrected.deviation?.vertical || "",
          "{{correctedDeviationHorizontal}}":
            corrected.deviation?.horizontal || "",
          "{{correctedAngleVertical}}": corrected.angle?.vertical || "",
          "{{correctedAngleHorizontal}}": corrected.angle?.horizontal || "",
          "{{correctedFrontFootVertical}}": corrected.frontFoot?.vertical || "",
          "{{correctedFrontFootHorizontal}}":
            corrected.frontFoot?.horizontal || "",
          "{{correctedRearFootVertical}}": corrected.rearFoot?.vertical || "",
          "{{correctedRearFootHorizontal}}":
            corrected.rearFoot?.horizontal || "",
        },
        images: remainingImages,
        firstImage: firstImage,
      });

      if (isConnected) {
        const base64 = await FileSystem.readAsStringAsync(filePath, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const response = await api.post("/upload", {
          file: base64,
          fileName,
        });
        console.log("responseresponseresponse", response.data.url);
        router.push({
          pathname: "/preview",
          params: { url: response.data.url },
        });
        Alert.alert("Upload feito com sucesso!", response.data.url);
      } else {
        router.push({
          pathname: "/preview",
          params: { filePath },
        });
        Alert.alert("PDF gerado localmente (offline)", filePath);
      }
    } catch (error) {
      console.error("Erro ao gerar ou enviar PDF:", error);
      Alert.alert("Erro", "Não foi possível gerar ou enviar o PDF.");
    }
  }

  return (
    <ScrollView className="flex-1 bg-gray-100 px-6 py-10">
      <Text className="text-3xl font-bold text-center mb-10">Preventix</Text>

      {/* Informações gerais */}
      <Section title="Informações gerais">
        <Label title="ID da máquina" value={general.machineId} />
        <Label title="Empresa" value={general.company} />
        <Label title="Data" value={general.date} />
        <Label title="Operador" value={general.operator} />
        <Label title="Notas" value={general.notes} />
      </Section>

      {/* Tolerâncias */}
      <Section title="Tolerâncias">
        <Label title="Velocidade (rpm)" value={general.speed} />
        <Label title="Desvio (mm)" value={general.deviation} />
        <Label title="Erro angular (mm/100)" value={general.angularError} />
      </Section>

      {/* Conforme encontrado */}
      <Section title="Conforme encontrado">
        {renderDualField(
          "Desvio (mm)",
          found.deviation?.vertical,
          found.deviation?.horizontal
        )}
        {renderDualField(
          "Ângulo (mm/100)",
          found.angle?.vertical,
          found.angle?.horizontal
        )}
        {renderDualField(
          "Pé dianteiro (mm)",
          found.frontFoot?.vertical,
          found.frontFoot?.horizontal
        )}
        {renderDualField(
          "Pé traseiro (mm)",
          found.rearFoot?.vertical,
          found.rearFoot?.horizontal
        )}
      </Section>

      {/* Conforme corrigido */}
      <Section title="Conforme corrigido">
        {renderDualField(
          "Desvio (mm)",
          corrected.deviation?.vertical,
          corrected.deviation?.horizontal
        )}
        {renderDualField(
          "Ângulo (mm/100)",
          corrected.angle?.vertical,
          corrected.angle?.horizontal
        )}
        {renderDualField(
          "Pé dianteiro (mm)",
          corrected.frontFoot?.vertical,
          corrected.frontFoot?.horizontal
        )}
        {renderDualField(
          "Pé traseiro (mm)",
          corrected.rearFoot?.vertical,
          corrected.rearFoot?.horizontal
        )}
      </Section>

      {/* Foto da máquina */}
      <Section title="Foto da máquina">
        <View className="flex-row flex-wrap gap-4">
          {formData.photos?.length ? (
            formData.photos.map((uri: string, index: number) => (
              <Image
                key={uri || index}
                source={{ uri }}
                className="w-[48%] h-40 rounded"
                resizeMode="cover"
              />
            ))
          ) : (
            <Text className="text-gray-500">Nenhuma foto adicionada.</Text>
          )}
        </View>
      </Section>

      {/* Botão final */}
      <TouchableOpacity
        className="bg-yellow-600 py-4 rounded mt-4 mb-12 flex-row justify-center items-center"
        onPress={handleGeneratePDF}
      >
        <Ionicons name="download-outline" size={20} color="white" />
        <Text className="text-white ml-2 font-semibold text-base">
          Gerar PDF
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className="mb-6">
      <Text className="bg-black text-white px-3 py-2 rounded font-semibold mb-2">
        {title}
      </Text>
      {children}
    </View>
  );
}

function Label({ title, value }: { title: string; value?: string }) {
  return (
    <View className="mb-2">
      <Text className="text-sm text-gray-600 mb-1">{title}</Text>
      <View className="bg-white p-2 border border-gray-300 rounded">
        <Text className="text-base text-black">{value || "—"}</Text>
      </View>
    </View>
  );
}

function renderDualField(
  label: string,
  vertical?: string,
  horizontal?: string
) {
  return (
    <View className="mb-2">
      <Text className="text-sm text-gray-600 mb-1">{label}</Text>
      <View className="flex-row justify-between gap-4">
        <View className="flex-1">
          <Text className="text-xs text-gray-500 mb-1">Vertical</Text>
          <View className="bg-white p-2 border border-gray-300 rounded">
            <Text>{vertical || "—"}</Text>
          </View>
        </View>
        <View className="flex-1">
          <Text className="text-xs text-gray-500 mb-1">Horizontal</Text>
          <View className="bg-white p-2 border border-gray-300 rounded">
            <Text>{horizontal || "—"}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
