import axios from "axios";
import { API_URL } from "./constants";
import NetInfo from "@react-native-community/netinfo";
import { saveCredentials, validateOfflineLogin } from "./utils";


export const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Login
export const login = async (email: string, password: string) => {
    const net = await NetInfo.fetch();

    if (net.isConnected) {
        // 🌐 LOGIN ONLINE
        try {
            const response = await api.post("/users/login", { email, password });

            // salva credenciais para login offline
            await saveCredentials(email, password);

            return response.data;
        } catch (error) {
            console.error(error);
            throw new Error("Erro ao fazer login online.");
        }
    } else {
        // 🔒 LOGIN OFFLINE
        const isValid = await validateOfflineLogin(email, password);
        if (isValid) {
            return {
                token: null,
                user: { email },
                offline: true,
            };
        } else {
            throw new Error("Credenciais inválidas para login offline.");
        }
    }
};

export const uploadPdf = async (fileBase64: string, fileName: string, token?: string) => {
    try {
        const response = await api.post(
            "/upload",
            { file: fileBase64, fileName },
            {
                headers: token
                    ? { Authorization: `Bearer ${token}` }
                    : undefined,
            }
        );

        return response.data;
    } catch (error) {
        console.error("Erro ao fazer upload:", error);
        throw new Error("Erro ao enviar o PDF.");
    }
};

