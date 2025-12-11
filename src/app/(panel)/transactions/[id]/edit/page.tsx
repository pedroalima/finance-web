import React, { useEffect, useState } from "react";
import { Alert } from "react-native";
import { useForm } from "react-hook-form";
import {
  deleteTransaction,
  getTransactionById,
  updateTransaction,
} from "@/src/service/transactionsService";
import { useMutation, useQuery } from "@tanstack/react-query";
import { parseCurrencyToNumber } from "@/src/utils/date";
import { useNavigation } from "expo-router";
import { useRoute } from "@react-navigation/native";
import { TransactionTypes } from "@/src/enums/transactions";
import { ActivityIndicator, Surface } from "react-native-paper";
import TransactionEditForm from "@/src/app/components/form/TransactionCreateAndEditForm";

export default function EditTransactionPage() {
  const navigation = useNavigation();
  const route = useRoute();
  const { id } = route.params;

  // Form
  const { setValue } = useForm({
    defaultValues: {
      amount: "",
      type_id: TransactionTypes.Despesa.toString(),
      date: new Date(),
      description: "",
      account_id: "",
      category_id: "",
      installment: false,
      installment_number: 0,
    },
  });

  // Buscar dados da transação
  const { data: transaction, isLoading } = useQuery({
    queryKey: ["transaction", id],
    queryFn: () => getTransactionById(id),
    select: (data) => {
      return {
        ...data,
        installment: data.installment ? true : false,
      };
    },
  });

  // Preencher formulário quando carregar
  useEffect(() => {
    if (transaction) {
      setValue("description", transaction.description);
      setValue("amount", String(transaction.amount));
      setValue("date", new Date(transaction.date));
      setValue("account_id", transaction.account_id);
      setValue("category_id", transaction.category_id);
      setValue("type_id", transaction.type_id);
      setValue("installment", transaction.installment);
      setValue("installment_number", transaction.installment_number || "");
    }
  }, [transaction, setValue]);

  // Mutation para atualizar
  const updateMutation = useMutation({
    mutationFn: (formData: any) => {
      return updateTransaction(id, {
        ...formData,
        amount: parseCurrencyToNumber(formData.amount),
      });
    },
    onSuccess: () => {
      Alert.alert("Sucesso", "Transação atualizada com sucesso!");
      navigation.goBack();
    },
    onError: (error) => {
      console.error(error);
      Alert.alert("Erro", "Falha ao atualizar transação.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (transactionId: number) => {
      return deleteTransaction(transactionId);
    },
    onSuccess: () => {
      Alert.alert("Sucesso", "Transação excluida com sucesso!");
      navigation.goBack();
    },
    onError: (error) => {
      console.error(error);
      Alert.alert("Erro", "Falha ao excluir transação.");
    },
  });

  const onSubmit = (formData: any) => {
    updateMutation.mutate(formData);
  };

  const handleDelete = (transactionId: number) => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir essa transação?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          onPress: () => {
            deleteMutation.mutate(transactionId);
          },
        },
      ]
    );
  };

  if (isLoading)
    return (
      <Surface style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator animating size="large" />
      </Surface>
    );

  return (
    <TransactionEditForm
      defaultValues={transaction}
      onSubmit={onSubmit}
      loading={updateMutation.isPending}
      submitText="Atualizar"
      handleDeleteTransaction={() => handleDelete(transaction.id)}
      showDeleteButton={true}
    />
  );
}
