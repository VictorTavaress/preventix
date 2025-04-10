import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import * as Print from 'expo-print';
import * as SecureStore from "expo-secure-store";
import * as Crypto from "expo-crypto";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const hashPassword = async (password: string) => {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );
};

export const saveCredentials = async (email: string, password: string) => {
  const hashed = await hashPassword(password);
  await AsyncStorage.setItem("credentials", JSON.stringify({ email, hashed }));
};

export const validateOfflineLogin = async (email: string, password: string) => {
  const stored = await AsyncStorage.getItem("credentials");
  if (!stored) return false;

  const { email: savedEmail, hashed } = JSON.parse(stored);
  const inputHashed = await hashPassword(password);

  return email === savedEmail && inputHashed === hashed;
};


export async function clearCredentials() {
  await SecureStore.deleteItemAsync("user_email");
  await SecureStore.deleteItemAsync("user_password_hash");
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface GeneratePdfParams {
  htmlTemplate: any;
  fileName: string;
  placeholders: Record<string, string>;
  images?: string[];
  imagePlaceholder?: string;
  onFinish?: (uri: string) => void;
  firstImage?: string; // <- aqui
}

export async function generatePdf({
  htmlTemplate,
  fileName,
  placeholders,
  images = [],
  imagePlaceholder = '{{photos}}',
  onFinish,
  firstImage = '',
}: GeneratePdfParams) {
  try {
    let html = htmlTemplate;

    // Substitui placeholders de texto
    Object.entries(placeholders).forEach(([key, value]) => {
      html = html.replace(new RegExp(key, 'g'), value);
    });

    // Substitui imagem principal (firstImage)
    if (firstImage) {
      const firstImageHTML = `<img src="${firstImage}" alt="Foto da máquina" style="max-width: 250px; max-height: 200px; border: 1px solid #ccc; border-radius: 4px; object-fit: cover;"  />`;
      html = html.replace('{{firstImage}}', firstImageHTML);
    } else {
      html = html.replace('{{firstImage}}', '');
    }

    // Adiciona seção de imagens em nova página se houver imagens
    if (images.length > 0) {
      const photosHTML = `
      <div style="page-break-before: always;"></div>
      <div style="background:rgb(255, 255, 255); min-height: 80vh; padding: 40px; font-family: Arial, sans-serif;">
        <div style="background:rgb(15, 155, 211); padding: 20px 32px; border-radius: 2px; margin-bottom: 20px; color: #fff; text-align: center;">
          <div style="font-size:16px; font-weight: bold;">Relatório de Alinhamento de Eixo</div>
          <div style="font-size: 12px; margin-top: 2px;">Alinhamento a Laser</div>
        </div>
        <div style="display: flex; flex-direction: row; flex-wrap: wrap; gap: 10px; margin-top: 20px;">
          ${images
          .map(
            (base64) =>
              `<img src="${base64}" style="width: 280px; height: auto; max-height: 300px; border: 1px solid #ccc; border-radius: 4px; object-fit: cover;" />`
          )
          .join('')}
        </div>
      </div>
    `;

      html = html.replace(imagePlaceholder, photosHTML);
    } else {
      html = html.replace(imagePlaceholder, ''); // remove placeholder se não houver imagens
    }

    // Gera o PDF
    const { uri } = await Print.printToFileAsync({
      html,
      base64: false,
    });

    if (onFinish) {
      onFinish(uri);
    }

    return uri;
  } catch (err) {
    console.error('Erro ao gerar PDF:', err);
    throw err;
  }
}
