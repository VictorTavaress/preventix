import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { login } from "~/lib/api";
import { useRouter } from "expo-router"; // 👈 Importa o roteador

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // 👈 Instância do roteador

  const handleLogin = async () => {
    setLoading(true);
    try {
      console.log("entrei");
      const data = await login(email, password);
      console.log("Token recebido:", data.token);
      // Redirecionar para outra tela
      router.push("/mode-selection"); // Caminho da nova tela
    } catch (error) {
      Alert.alert(String(error));
    }
    setLoading(false);
  };

  return (
    <View className="flex-1 justify-center items-center bg-[#0D0D1B]">
      <Image
        source={require("assets/images/Headline.png")}
        className="w-96 h-12 mb-12"
        resizeMode="contain"
      />

      <View className="w-full max-w-sm bg-white p-4 rounded-xl shadow-md">
        <View className="flex-row items-center border-b border-gray-300 pt-1 pb-4 mb-4">
          <Ionicons name="mail" size={20} color="gray" className="mr-2" />
          <TextInput
            placeholder="Email"
            className="flex-1 text-lg"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View className="flex-row items-center border-gray-300 pb-1">
          <Ionicons
            name="lock-closed"
            size={20}
            color="gray"
            className="mr-4"
          />
          <TextInput
            placeholder="Senha"
            className="flex-1 text-lg"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View>
      </View>
      <View className="w-full max-w-sm p-4 rounded-xl shadow-md mt-4">
        <TouchableOpacity>
          <Text className="text-center text-white underline mb-8">
            Esqueceu a senha ?
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-yellow-600 py-3 rounded-lg"
          onPress={handleLogin}
        >
          <Text className="text-center text-white text-lg font-semibold">
            {loading ? "Entrando..." : "Entrar"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
