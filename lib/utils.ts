import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import * as Print from 'expo-print';
import * as SecureStore from "expo-secure-store";
import * as Crypto from "expo-crypto";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface GeneratePdfParams {
  htmlTemplate: any;
  fileName: string;
  placeholders: Record<string, string>;
  images?: string[];
  imagePlaceholder?: string;
  onFinish?: (uri: string) => void;
  firstImage?: string;
  staticImage?: string; // base64 ou caminho local
  companyLogo?: string; // base64 ou caminho local
  chartImage?: string; // base64 ou caminho local
}

export const hashPassword = async (password: string) => {
  if (!password || typeof password !== 'string') {
    throw new Error("Senha inválida para hash.");
  }
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

export const saveUser = async (user: any) => {
  try {
    await AsyncStorage.setItem("user_data", JSON.stringify(user));
  } catch (err) {
    console.error("Erro ao salvar dados do usuário offline:", err);
  }
};

export const getSavedUser = async () => {
  try {
    const user = await AsyncStorage.getItem("user_data");
    return user ? JSON.parse(user) : null;

  } catch (err) {
    console.error("Erro ao recuperar dados do usuário offline:", err);
    return null;
  }
};

export async function clearCredentials() {
  await SecureStore.deleteItemAsync("user_email");
  await SecureStore.deleteItemAsync("user_password_hash");
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function generatePdf({
  htmlTemplate,
  fileName,
  placeholders,
  images = [],
  imagePlaceholder = '{{photos}}',
  onFinish,
  firstImage = '',
  staticImage = '',
  companyLogo = '',
  chartImage = '',
}: GeneratePdfParams) {
  try {
    let html = htmlTemplate;

    // Substitui placeholders de texto
    Object.entries(placeholders).forEach(([key, value]) => {
      html = html.replace(new RegExp(key, 'g'), value);
    });

    // Substitui imagem principal (firstImage)
    if (firstImage) {
      const firstImageHTML = `<img src="${firstImage}" alt="Foto da máquina" style="max-width: 250px; max-height: 200px; border: 1px solid #ccc; border-radius: 4px; object-fit: cover;" />`;
      html = html.replace('{{firstImage}}', firstImageHTML);
    } else {
      html = html.replace('{{firstImage}}', '');
    }

    if (companyLogo) {
      const companyLogoHTML = `<img src="${companyLogo}" alt="Foto da máquina" style="max-width: 50px; max-height: 50px; border: 1px solid #ccc; border-radius: 4px; object-fit: cover;" />`;
      html = html.replace('{{companyLogo}}', companyLogoHTML);
    } else {
      html = html.replace('{{companyLogo}}', '');
    }

    // Substitui imagem estática (staticImage)
    if (staticImage) {
      const staticImageHTML = `<img src="${staticImage}"alt="Alinhamento Motor" style="width: 150px;" />`;
      html = html.replace('{{staticImageCorrected}}', staticImageHTML);
      html = html.replace('{{staticImageFounded}}', staticImageHTML);
    } else {
      html = html.replace('{{staticImageCorrected}}', '');
      html = html.replace('{{staticImageFounded}}', '');
    }

    if (chartImage) {
      const chartImageHTML = `<img src="${chartImage}" alt="Gráfico de Alinhamento" style="width: 58%; height: 210px;" />`;
      html = html.replace('{{chartImage}}', chartImageHTML);
    }

    const backgroundColor = fileName.startsWith('Balanceamento') ? 'rgb(0, 82, 155)' : 'rgb(15, 155, 211)';
    const title = fileName.startsWith('Balanceamento') ? 'Relatório de Balanceamento' : 'Relatório de Alinhamento de Eixo';
    const subtitle = fileName.startsWith('Balanceamento') ? 'Balanceamento Dinâmico' : 'Alinhamento a Laser';

    // Seção de múltiplas imagens
    if (images.length > 0) {
      const photosHTML = `
        <div style="page-break-before: always;"></div>
        <div style="background:rgb(255, 255, 255); min-height: 80vh; padding: 40px; font-family: Arial, sans-serif;">
          <div style="background: ${backgroundColor}; padding: 20px 32px; border-radius: 2px; margin-bottom: 20px; color: #fff; text-align: center;">
            <div style="font-size:16px; font-weight: bold;">${title}</div>
            <div style="font-size: 12px; margin-top: 2px;">${subtitle}</div>
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
      html = html.replace(imagePlaceholder, '');
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

