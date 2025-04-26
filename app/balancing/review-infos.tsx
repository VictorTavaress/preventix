import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useForm } from "../../lib/formContext";
import { Ionicons } from "@expo/vector-icons";
import { generatePdf } from "../../lib/utils";
import { balancingTemplate } from "../../assets/pdf-template/balancing-pdf"; // template em string
import { router } from "expo-router";
import NetInfo from "@react-native-community/netinfo";
import * as FileSystem from "expo-file-system";
import { api } from "../../lib/api"; // onde está seu axios configurado
import {
  staticImage,
  stratosImage,
  predimaxImage,
  preventixImage,
  senseImage,
} from "../../assets/images/base64Static";
import { useAuth } from "../../lib/authContext";
import { VibChart } from "../../components/chart/chartBalancing";

export default function ReviewInfosScreen() {
  const { formData } = useForm();
  const { user }: any = useAuth(); // Pegando os dados do usuário do contexto
  const general = formData.generalInfo || {};
  const massCorrection = formData.massCorrection || {};
  const vibration = formData.vibration || {};
  const [isGenerating, setIsGenerating] = useState(false);
  const [chartBase64, setChartBase64] = useState<string | null>(null);

  async function handleGeneratePDF() {
    setIsGenerating(true);
    const fileName =
      `Balanceamento-${general.client}-${general.technician}.pdf`.replace(
        /\s+/g,
        "_"
      );

    const allPhotos = Array.isArray(formData.photos) ? formData.photos : [];
    const firstImage = allPhotos[0] || "";
    const remainingImages = allPhotos.slice(1); // ← Apenas array, sem map nem join
    let companyLogo = preventixImage; // valor padrão

    if (user?.company?.toLowerCase() === "stratos") {
      companyLogo = stratosImage;
    } else if (user?.company?.toLowerCase() === "predimax") {
      companyLogo = predimaxImage;
    } else if (user?.company?.toLowerCase() === "sense") {
      companyLogo = senseImage;
    }
    try {
      const { isConnected } = await NetInfo.fetch();
      const filePath = await generatePdf({
        htmlTemplate: balancingTemplate,
        fileName,
        placeholders: {
          // Informações gerais
          "{{client}}": general.client || "",
          "{{date}}": general.date || "",
          "{{requester}}": general.requester || "",
          "{{tag}}": general.tag || "",
          "{{technician}}": general.technician || "",
          "{{notes}}": general.notes || "",

          // Infos da maquina
          "{{rotation}}": general.rotation || "",
          "{{power}}": general.power || "",
          "{{blades}}": general.blades || "",
          "{{transmissionType}}": general.transmissionType || "",

          // Balanceamento - Correção de Massa (ponto 1)
          "{{angle1}}": massCorrection?.test1?.angle || "",
          "{{weight1}}": massCorrection?.test1?.weight || "",
          "{{correctionAngle1}}": massCorrection?.test1?.correctionAngle || "",
          "{{correctionWeight1}}":
            massCorrection?.test1?.correctionWeight || "",

          // Balanceamento - Correção de Massa (ponto 2)
          "{{angle2}}": massCorrection?.test2?.angle || "",
          "{{weight2}}": massCorrection?.test2?.weight || "",
          "{{correctionAngle2}}": massCorrection?.test2?.correctionAngle || "",
          "{{correctionWeight2}}":
            massCorrection?.test2?.correctionWeight || "",

          // Vibração
          "{{initial1}}": vibration?.initial1 || "",
          "{{final1}}": vibration?.final1 || "",
          "{{result1}}": vibration?.result1 || "",

          "{{initial2}}": vibration?.initial2 || "",
          "{{final2}}": vibration?.final2 || "",
          "{{result2}}": vibration?.result2 || "",
        },
        images: remainingImages,
        firstImage: firstImage,
        staticImage: staticImage,
        companyLogo,
        chartImage: chartBase64 || "",
      });

      if (isConnected) {
        const base64 = await FileSystem.readAsStringAsync(filePath, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const response = await api.post("/upload", {
          file: base64,
          fileName,
        });
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
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <ScrollView className="flex-1 bg-gray-100 px-6 py-10">
      <Text className="text-3xl font-bold text-center mb-10">Preventix</Text>

      {/* Informações Gerais */}
      <Section title="Informações gerais">
        <View className="flex-row gap-4">
          <View className="flex-1">
            <Label title="Técnico" value={general.technician} />
          </View>
          <View className="flex-1">
            <Label title="Data" value={general.date} />
          </View>
        </View>
        <View className="flex-row gap-4">
          <View className="flex-1">
            <Label title="Cliente" value={general.client} />
          </View>
          <View className="flex-1">
            <Label title="Solicitante" value={general.requester} />
          </View>
        </View>
        <View className="flex-row gap-4">
          <View className="flex-1">
            <Label title="Potência (kW)" value={general.power} />
          </View>
          <View className="flex-1">
            <Label title="RPM" value={general.rotation} />
          </View>
        </View>
        <View className="flex-row gap-4">
          <View className="flex-1">
            <Label title="Nº de pás" value={general.blades} />
          </View>
          <View className="flex-1">
            <Label
              title="Tipo de transmissão"
              value={general.transmissionType}
            />
          </View>
        </View>
        <Label title="TAG" value={general.tag} />
      </Section>

      {/* Correção de massa */}
      <Section title="Correções de massa">
        {Object.entries(massCorrection).map(([testName, data]: any) => (
          <View key={testName} className="mb-4">
            <Text className="font-semibold text-base text-gray-700 mb-2">
              {testName === "test1" ? "Teste de massa 1" : "Teste de massa 2"}
            </Text>
            <View className="flex-row gap-4">
              <View className="flex-1">
                <Label title="Peso" value={data.weight} />
              </View>
              <View className="flex-1">
                <Label title="Ângulo" value={data.angle} />
              </View>
            </View>
            <View className="flex-row gap-4">
              <View className="flex-1">
                <Label title="Peso de correção" value={data.correctionWeight} />
              </View>
              <View className="flex-1">
                <Label
                  title="Ângulo de correção"
                  value={data.correctionAngle}
                />
              </View>
            </View>
          </View>
        ))}
      </Section>

      <Section title="Vibração">
        <View className="mb-4">
          <Text className="font-semibold text-base text-gray-700 mb-2">
            Teste de vibração 1
          </Text>
          <View className="flex-row gap-4">
            <View className="flex-1">
              <Label title="Valor incial" value={vibration.initial1} />
            </View>
            <View className="flex-1">
              <Label title="Valor final" value={vibration.final1} />
            </View>
          </View>
          <Label title="Resultado" value={vibration.result1} />
        </View>
        <View className="mb-4">
          <Text className="font-semibold text-base text-gray-700 mb-2">
            Teste de vibração 2
          </Text>
          <View className="flex-row gap-4">
            <View className="flex-1">
              <Label title="Valor incial" value={vibration.initial2} />
            </View>
            <View className="flex-1">
              <Label title="Valor final" value={vibration.final2} />
            </View>
          </View>
          <Label title="Resultado" value={vibration.result2} />
        </View>
      </Section>

      <Section title="Gráfico de vibração">
        <View className="mb-6">
          <VibChart visible={true} onCapture={setChartBase64} />
        </View>
      </Section>

      {/* Fotos */}
      <Section title="Fotos do processo">
        {formData.photos?.length ? (
          <>
            <Image
              source={{ uri: formData.photos[0] }}
              className="w-full h-52 mb-4 rounded"
              resizeMode="cover"
            />
            <View className="flex-row flex-wrap gap-4">
              {formData.photos.slice(1).map((uri: string, index: number) => (
                <Image
                  key={uri || index}
                  source={{ uri }}
                  className="w-[48%] h-40 rounded"
                  resizeMode="cover"
                />
              ))}
            </View>
          </>
        ) : (
          <Text className="text-gray-500">Nenhuma foto adicionada.</Text>
        )}
      </Section>
      {/* Botão final */}
      <TouchableOpacity
        className={`py-4 rounded mt-4 mb-12 flex-row justify-center items-center ${
          isGenerating ? "bg-yellow-400" : "bg-yellow-600"
        }`}
        onPress={handleGeneratePDF}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <>
            <Ionicons name="time-outline" size={20} color="white" />
            <Text className="text-white ml-2 font-semibold text-base">
              Gerando...
            </Text>
          </>
        ) : (
          <>
            <Ionicons name="download-outline" size={20} color="white" />
            <Text className="text-white ml-2 font-semibold text-base">
              Gerar PDF
            </Text>
          </>
        )}
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
      <Text className="bg-[#0D0D1B] text-white px-3 py-2 rounded font-semibold mb-2">
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
