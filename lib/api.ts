import axios from "axios";
import { API_URL } from "./constants";
import NetInfo from "@react-native-community/netinfo";
import { saveCredentials, validateOfflineLogin, saveUser } from "./utils";


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

// Função para obter o usuário por e-mail
export const getUserByEmail = async (email: string, token: string, password: string) => {
    const net = await NetInfo.fetch();
    if (net.isConnected) {
        // 🌐 CONSULTA ONLINE
        try {
            const response = await api.get(`/users/email?email=${email}`, {
                headers: {
                    Authorization: `Bearer ${token}`,  // Passa o token no header
                },
            });
            saveUser(response.data);  // Salva os dados do usuário offline
            return response.data;  // Retorna os dados do usuário
        } catch (error) {
            console.error("Erro ao buscar o usuário:", error);
            throw new Error("Erro ao buscar o usuário online.");
        }
    } else {
        // 🔒 CONSULTA OFFLINE (se necessário)
        const user = await validateOfflineLogin(email, password);  // Verifique as credenciais armazenadas offline
        if (user) {
            return {
                token: null,
                user: { email },
                offline: true,
            };
        } else {
            throw new Error("Usuário não encontrado offline.");
        }
    }
};


