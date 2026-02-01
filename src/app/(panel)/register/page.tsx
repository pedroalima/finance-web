import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "../../../styles/global";
import z from "zod";
import { RegisterData } from "../../../types/auth";
import { registerUser } from "../../../service/authService";
import { Input } from "../../components/form/Input";

export const registerSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  email: z.email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export default function Register() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      alert("Conta criada com sucesso!");
      router.replace("/"); // Volta para a tela de login
    },
    onError: () => alert("Erro ao cadastrar. E-mail pode já estar em uso."),
  });

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
        Criar Conta
      </Text>

      <Input
        name="name"
        control={control}
        placeholder="Nome Completo"
        error={errors.name?.message}
      />

      <Input
        name="email"
        control={control}
        placeholder="E-mail"
        autoCapitalize="none"
        keyboardType="email-address"
        error={errors.email?.message}
      />

      <Input
        name="password"
        control={control}
        placeholder="Senha"
        secureTextEntry
        error={errors.password?.message}
      />

      <TouchableOpacity
        onPress={handleSubmit((data) => mutate(data))}
        disabled={isPending}
        style={[
          styles.button,
          {
            width: "100%",
            alignItems: "center",
            marginTop: 10,
            opacity: isPending ? 0.7 : 1,
          },
        ]}
      >
        {isPending ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={{ color: "#FFF" }}>Cadastrar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
        <Text style={{ color: "#555" }}>Já tem uma conta? Faça login</Text>
      </TouchableOpacity>
    </View>
  );
}
