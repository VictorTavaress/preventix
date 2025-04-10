import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { WebView } from "react-native-webview";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as IntentLauncher from "expo-intent-launcher";
import * as Linking from "expo-linking";
import NetInfo from "@react-native-community/netinfo";
import { useLocalSearchParams } from "expo-router";

export default function PdfPreviewScreen() {
  const { url, filePath } = useLocalSearchParams();
  const rawPath = url || filePath;
  const path = Array.isArray(rawPath) ? rawPath[0] : rawPath;

  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [localPath, setLocalPath] = useState<string | null>(null);

  // Verifica se o arquivo já foi baixado
  useEffect(() => {
    const checkIfFileExists = async () => {
      if (!path || !path.startsWith("http")) return;

      const fileName = path.split("/").pop();
      if (!FileSystem.documentDirectory) {
        throw new Error("Document directory is not available.");
      }
      const fileUri = FileSystem.documentDirectory + fileName;

      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      if (fileInfo.exists) {
        setLocalPath(fileInfo.uri);
      }
    };
    checkIfFileExists();
  }, [path]);

  // Verifica conexão
  useEffect(() => {
    const checkConnectivity = async () => {
      const net = await NetInfo.fetch();
      setIsOnline(net.isConnected);
    };
    checkConnectivity();
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  const handleDownload = async () => {
    if (!path || !path.startsWith("http")) return;

    setIsDownloading(true);
    try {
      if (!FileSystem.documentDirectory) {
        throw new Error("Document directory is not available.");
      }
      const fileUri = FileSystem.documentDirectory + path.split("/").pop();
      const downloadResumable = FileSystem.createDownloadResumable(
        path,
        fileUri
      );
      const result = await downloadResumable.downloadAsync();
      if (result && result.uri) {
        setLocalPath(result.uri);
        Alert.alert("Download", "PDF baixado com sucesso.");
      } else {
        throw new Error("Download result is undefined or invalid.");
      }
    } catch (error) {
      console.error("Erro ao baixar PDF:", error);
      Alert.alert("Erro", "Falha ao baixar o PDF.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      const uriToShare = localPath ?? path;
      if (uriToShare) {
        await Sharing.shareAsync(uriToShare);
      } else {
        Alert.alert("Erro", "Nenhum arquivo disponível para compartilhar.");
      }
    } catch (err) {
      console.error("Erro ao compartilhar:", err);
      Alert.alert("Erro", "Falha ao compartilhar.");
    }
  };

  const handleOpenWithExternalApp = async () => {
    if (!localPath) return;

    if (Platform.OS === "android") {
      IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
        data: localPath,
        flags: 1,
        type: "application/pdf",
      });
    } else {
      await Linking.openURL(localPath);
    }
  };

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="text-center text-3xl font-bold mb-4">Preventix</Text>

      <View className="flex-1 border border-gray-400 rounded overflow-hidden">
        {isOnline && path?.startsWith("http") ? (
          <WebView
            originWhitelist={["*"]}
            source={{ uri: path }}
            style={{ flex: 1 }}
            startInLoadingState
            renderLoading={() => (
              <ActivityIndicator
                style={{ marginTop: 20 }}
                size="large"
                color="#999"
              />
            )}
          />
        ) : localPath ? (
          <View className="flex-1 justify-center items-center p-4">
            <Text className="text-lg font-semibold text-center mb-2 text-yellow-700">
              PDF disponível offline!
            </Text>
            <Text className="text-center text-gray-600 mb-4">
              Você pode abrir o PDF com um aplicativo externo.
            </Text>
            <TouchableOpacity
              onPress={handleOpenWithExternalApp}
              className="bg-green-700 px-4 py-2 rounded"
            >
              <Text className="text-white font-semibold">Abrir PDF</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-1 justify-center items-center p-4">
            <Text className="text-center text-gray-500 mb-2 text-lg">
              PDF gerado com sucesso!
            </Text>
            <Text className="text-center text-gray-400 text-sm">
              Você está offline. A visualização não está disponível.
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        className="bg-yellow-600 py-3 rounded mt-4"
        onPress={handleShare}
      >
        <Text className="text-white text-center font-semibold">
          📤 Compartilhar
        </Text>
      </TouchableOpacity>

      {isOnline && path?.startsWith("http") && (
        <TouchableOpacity
          className="bg-yellow-800 py-3 rounded mt-2"
          onPress={handleDownload}
          disabled={isDownloading}
        >
          <Text className="text-white text-center font-semibold">
            {isDownloading ? "⏳ Baixando..." : "📥 Baixar PDF"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
