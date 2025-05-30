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
import { alignmentTemplate } from "../../assets/pdf-template/alignment-pdf"; // template em string
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

export default function ReviewInfosScreen() {
  const { formData } = useForm();
  const { user }: any = useAuth(); // Pegando os dados do usuário do contexto
  const general = formData.generalInfo || {};
  const found = formData.alignmentInfo?.found || {};
  const corrected = formData.alignmentInfo?.corrected || {};
  const [isGenerating, setIsGenerating] = useState(false);

  function compareWithTolerance(
    value: number | string | undefined | null,
    tolerance: number | string | undefined | null
  ): string {
    if (
      value === undefined ||
      value === null ||
      tolerance === undefined ||
      tolerance === null
    )
      return "";

    // Corrige vírgula decimal e extrai número do valor
    const parsedValue =
      typeof value === "string"
        ? parseFloat(value.replace(",", ".").match(/[\d.]+/)?.[0] ?? "")
        : value;

    // Corrige vírgula decimal e extrai número da tolerância
    const parsedTolerance =
      typeof tolerance === "string"
        ? parseFloat(tolerance.replace(",", ".").match(/[\d.]+/)?.[0] ?? "")
        : tolerance;

    if (isNaN(parsedValue) || isNaN(parsedTolerance)) return "";

    const isOk = Math.abs(parsedValue) <= parsedTolerance;
    const symbol = isOk ? "✓" : "✗";
    const color = isOk ? "green" : "red";

    return `<span>${parsedValue.toFixed(
      2
    )} <span style="color: ${color}; font-weight: bold;">${symbol}</span></span>`;
  }

  async function handleGeneratePDF() {
    setIsGenerating(true);
    const fileName =
      `Alinhamento-${general.company}-${general.operator}.pdf`.replace(
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

          // Conforme encontrado (com lógica de tolerância)
          "{{foundDeviationVertical}}": compareWithTolerance(
            found.deviation?.vertical,
            general.deviation
          ),
          "{{foundDeviationHorizontal}}": compareWithTolerance(
            found.deviation?.horizontal,
            general.deviation
          ),
          "{{foundAngleVertical}}": compareWithTolerance(
            found.angle?.vertical,
            general.angularError
          ),
          "{{foundAngleHorizontal}}": compareWithTolerance(
            found.angle?.horizontal,
            general.angularError
          ),

          // Pés encontrados (sem comparação)
          "{{foundFrontFootVertical}}": found.frontFoot?.vertical || "",
          "{{foundFrontFootHorizontal}}": found.frontFoot?.horizontal || "",
          "{{foundRearFootVertical}}": found.rearFoot?.vertical || "",
          "{{foundRearFootHorizontal}}": found.rearFoot?.horizontal || "",

          // Conforme corrigido (com lógica de tolerância)
          "{{correctedDeviationVertical}}": compareWithTolerance(
            corrected.deviation?.vertical,
            general.deviation
          ),
          "{{correctedDeviationHorizontal}}": compareWithTolerance(
            corrected.deviation?.horizontal,
            general.deviation
          ),
          "{{correctedAngleVertical}}": compareWithTolerance(
            corrected.angle?.vertical,
            general.angularError
          ),
          "{{correctedAngleHorizontal}}": compareWithTolerance(
            corrected.angle?.horizontal,
            general.angularError
          ),

          // Pés corrigidos (sem comparação)
          "{{correctedFrontFootVertical}}": corrected.frontFoot?.vertical || "",
          "{{correctedFrontFootHorizontal}}":
            corrected.frontFoot?.horizontal || "",
          "{{correctedRearFootVertical}}": corrected.rearFoot?.vertical || "",
          "{{correctedRearFootHorizontal}}":
            corrected.rearFoot?.horizontal || "",
        },
        images: remainingImages,
        firstImage: firstImage,
        staticImage: staticImage,
        companyLogo,
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
        {formData.photos?.length ? (
          <>
            {/* Foto de cabeçalho */}
            <Image
              source={{ uri: formData.photos[0] }}
              className="w-full h-52 mb-4 rounded"
              resizeMode="cover"
            />

            {/* Outras fotos em grid */}
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
