import axios from "axios";
import { API_URL } from "./constants";

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Login
export const login = async (email: string, password: string) => {
    try {
        const response = await api.post("/users/login", { email, password });
        return response.data;
    } catch (error) {
        console.error(error)
        throw new Error("Erro ao fazer login");
    }
};
