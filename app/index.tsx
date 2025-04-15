import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";
import { login, getUserByEmail } from "~/lib/api";
import { useRouter } from "expo-router";
import { useAuth } from "~/lib/authContext";
import { getSavedUser } from "~/lib/utils";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const router = useRouter();
  const { setUser } = useAuth(); // Usando o setEmail do contexto

  // Verifica conectividade
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const data = await login(email, password);
      const user = await getUserByEmail(email, data.token, password);
      if (user.offline) {
        const userOffline = await getSavedUser();
        setUser(userOffline);
      } else {
        setUser(user);
      }
      router.push("/mode-selection");
    } catch (error) {
      Alert.alert("Erro ao entrar", String(error));
    }
    setLoading(false);
  };

  return (
    <View className="flex-1 justify-center items-center bg-[#0D0D1B]">
      <Image
        source={require("assets/images/logotipopreventix.png")}
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

      {/* Status de Conexão */}
      <Text className="text-white mt-4 text-sm">
        Status:{" "}
        <Text className={isOnline ? "text-green-400" : "text-red-400"}>
          {isOnline === null
            ? "Verificando..."
            : isOnline
            ? "Online"
            : "Offline"}
        </Text>
      </Text>

      <View className="w-full max-w-sm p-4 rounded-xl shadow-md mt-4">
        {/* <TouchableOpacity>
          <Text className="text-center text-white underline mb-8">
            Esqueceu a senha ?
          </Text>
        </TouchableOpacity> */}

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
