// src/screens/CreateTransactionScreen.js
import React from "react";
import {
  View,
  Text,
  TextInput,
  Switch,
  Button,
  Alert,
  ScrollView,
} from "react-native";
import styles from "@/src/styles/global";
import { useRoute, useNavigation } from "@react-navigation/native";
import { api } from "@/src/service/axios/config";
import { useForm, Controller } from "react-hook-form";

export default function CreateTransaction() {
  const route = useRoute();
  const navigation = useNavigation();
  // const { userId } = route.params;

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      amount: "",
      typeId: "",
      date: "",
      description: "",
      accountId: "",
      categoryId: "",
      installment: false,
      installmentNumber: "",
    },
  });

  const installment = watch("installment");

  const onSubmit = async (data) => {
    const payload = {
      user_id: 1, // pode pegar do params depois
      amount: parseFloat((parseInt(data.amount, 10) / 100).toFixed(2)),
      type_id: parseInt(data.typeId),
      date: dateToApiDate(formatDate(data.date)),
      description: data.description,
      account_id: parseInt(data.accountId),
      category_id: parseInt(data.categoryId),
      installment: data.installment,
      installment_number: parseInt(data.installmentNumber) || 0,
    };

    try {
      const response = await api.post(
        "http://localhost:8080/api/transactions",
        payload
      );

      if (response.status === 201) {
        Alert.alert("Sucesso", "Transação criada com sucesso!");
        navigation.goBack();
      } else {
        console.log(response);
        Alert.alert("Erro", "Falha ao criar transação.");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Não foi possível conectar ao servidor.");
    }
  };

  // Função para formatar moeda
  const formatCurrency = (value) => {
    if (!value) return "";
    // Remove tudo que não for número
    const onlyNums = value.replace(/\D/g, "");
    // Divide por 100 para ter duas casas decimais
    const num = (parseInt(onlyNums, 10) / 100).toFixed(2);
    // Substitui ponto por vírgula e adiciona prefixo R$
    return "R$ " + num.replace(".", ",");
  };

  // Função para formatar data (AAAA-MM-DD)
  const formatDate = (value) => {
    if (!value) return "";
    const onlyNums = value.replace(/\D/g, "");
    if (onlyNums.length <= 2) return onlyNums; // dia
    if (onlyNums.length <= 4) {
      return onlyNums.replace(/(\d{2})(\d{1,2})/, "$1/$2"); // dia/mes
    }
    return onlyNums.replace(/(\d{2})(\d{2})(\d{1,2})/, "$1/$2/$3"); // dia/mes/ano
  };

  // Converte "DD/MM/AA" → "AAAA-MM-DD"
  const dateToApiDate = (value) => {
    if (!value) return "";
    const [day, month, year] = value.split("/");
    return `20${year}-${month}-${day}`; // 20AA
  };

  return (
    <ScrollView
      style={styles.fullScreenContainer}
      contentContainerStyle={{ padding: 16 }}
    >
      <View style={styles.card}>
        {/* Valor */}
        <Text style={styles.description}>Valor</Text>
        <Controller
          control={control}
          name="amount"
          rules={{ required: "O valor é obrigatório" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Ex.: 10.50"
              keyboardType="numeric"
              value={formatCurrency(value)}
              onChangeText={(text) => onChange(text.replace(/[^0-9.,]/g, ""))}
              style={styles.input}
            />
          )}
        />
        {errors.amount && (
          <Text style={{ color: "red" }}>{errors.amount.message}</Text>
        )}

        {/* Tipo */}
        <Text style={styles.description}>Tipo (ID)</Text>
        <Controller
          control={control}
          name="typeId"
          rules={{ required: "O tipo é obrigatório" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Ex.: 1 para Receita, 2 para Despesa"
              keyboardType="numeric"
              value={value}
              onChangeText={onChange}
              style={styles.input}
            />
          )}
        />
        {errors.typeId && (
          <Text style={{ color: "red" }}>{errors.typeId.message}</Text>
        )}

        {/* Data */}
        <Text style={styles.description}>Data</Text>
        <Controller
          control={control}
          name="date"
          rules={{ required: "A data é obrigatória" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="DD-MM-AA"
              keyboardType="numeric"
              value={formatDate(value)}
              onChangeText={(text) => onChange(text.replace(/[^0-9-]/g, ""))}
              maxLength={8}
              style={styles.input}
            />
          )}
        />
        {errors.date && (
          <Text style={{ color: "red" }}>{errors.date.message}</Text>
        )}

        {/* Descrição */}
        <Text style={styles.description}>Descrição</Text>
        <Controller
          control={control}
          name="description"
          rules={{ required: "A descrição é obrigatória" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Descrição"
              value={value}
              onChangeText={onChange}
              style={styles.input}
            />
          )}
        />
        {errors.description && (
          <Text style={{ color: "red" }}>{errors.description.message}</Text>
        )}

        {/* Conta */}
        <Text style={styles.description}>Conta (ID)</Text>
        <Controller
          control={control}
          name="accountId"
          rules={{ required: "A conta é obrigatória" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="ID da Conta"
              keyboardType="numeric"
              value={value}
              onChangeText={onChange}
              style={styles.input}
            />
          )}
        />
        {errors.accountId && (
          <Text style={{ color: "red" }}>{errors.accountId.message}</Text>
        )}

        {/* Categoria */}
        <Text style={styles.description}>Categoria (ID)</Text>
        <Controller
          control={control}
          name="categoryId"
          rules={{ required: "A categoria é obrigatória" }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="ID da Categoria"
              keyboardType="numeric"
              value={value}
              onChangeText={onChange}
              style={styles.input}
            />
          )}
        />
        {errors.categoryId && (
          <Text style={{ color: "red" }}>{errors.categoryId.message}</Text>
        )}

        {/* Switch Parcelado */}
        <View style={styles.switchContainer}>
          <Text style={[styles.description, { flex: 1 }]}>Parcelado?</Text>
          <Controller
            control={control}
            name="installment"
            render={({ field: { onChange, value } }) => (
              <Switch value={value} onValueChange={onChange} />
            )}
          />
        </View>

        {/* Número de Parcelas */}
        {installment && (
          <>
            <Text style={styles.description}>Número de Parcelas</Text>
            <Controller
              control={control}
              name="installmentNumber"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Ex.: 3"
                  keyboardType="numeric"
                  value={value}
                  onChangeText={onChange}
                  style={styles.input}
                />
              )}
            />
          </>
        )}

        <Button
          title="Criar Transação"
          color="#34313f"
          onPress={handleSubmit(onSubmit)}
        />
      </View>
    </ScrollView>
  );
}
