import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import styles from "../styles/global";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { LoginData } from "../types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../service/authService";
import { Input } from "./components/form/Input";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const loginSchema = z.object({
  email: z.email("E-mail inválido").min(1, "O e-mail é obrigatório"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export default function Home() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: async (data) => {
      const token = data.token || data.data?.token;

      if (token) {
        await AsyncStorage.setItem("@finance:token", token);
        router.replace("/(panel)/dashboard/page");
      }
    },
    onError: () => alert("Credenciais inválidas."),
  });

  const onSubmit = (data: LoginData) => mutate(data);

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
      }}
    >
      <Text style={{ fontSize: 24, marginBottom: 20, fontWeight: "bold" }}>
        Login
      </Text>

      <Input
        name="email"
        control={control}
        placeholder="E-mail"
        autoCapitalize="none"
        keyboardType="email-address"
        error={errors.email?.message}
      />

      {/* Input de Senha */}
      <Input
        name="password"
        control={control}
        placeholder="Senha"
        secureTextEntry
        error={errors.password?.message}
      />

      <TouchableOpacity
        onPress={handleSubmit(onSubmit)}
        disabled={isPending}
        style={[
          styles.button,
          { width: "100%", alignItems: "center", opacity: isPending ? 0.7 : 1 },
        ]}
      >
        {isPending ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={{ color: "#FFF" }}>Entrar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.replace("/(panel)/register/page")}
        style={[styles.button, { width: "100%", alignItems: "center" }]}
      >
        {isPending ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={{ color: "#FFF" }}>Registrar</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
