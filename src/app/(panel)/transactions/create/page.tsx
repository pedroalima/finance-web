// src/screens/CreateTransactionScreen.js
import { useState } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { TransactionTypes } from "@/src/enums/transactions";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { formatDateToApi, parseCurrencyToNumber } from "@/src/utils/date";
import { createTransaction } from "@/src/service/transactionsService";
import { Transaction } from "@/src/types/transactions";
import TransactionForm from "@/src/app/components/form/TransactionForm";

export default function CreateTransaction() {
  const navigation = useNavigation();
  const [show, setShow] = useState(false);
  const queryClient = new QueryClient();
  // const { userId } = route.params;

  const [transaction, setTransaction] = useState({
    amount: "",
    type_id: TransactionTypes.Despesa.toString(),
    date: new Date(),
    description: "",
    account_id: "",
    category_id: "",
    installment: false,
    installment_number: 0,
  });

  useForm({
    defaultValues: transaction,
  });

  const createTransactionMutation = useMutation({
    mutationFn: (data: Transaction) => createTransaction(data),
    onSuccess: (response) => {
      if (response.status === 200) {
        Alert.alert("Sucesso", response.data.message);
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
        navigation.goBack();
      }
    },
    onError: (error) => {
      console.error(error);
      Alert.alert("Erro", "Falha ao criar transação.");
    },
  });

  const onSubmit = async (data: any) => {
    const payload = {
      ...data,
      date: formatDateToApi(data.date),
      amount: parseCurrencyToNumber(data.amount),
      user_id: 1,
    };

    createTransactionMutation.mutate(payload);
  };

  return (
    <TransactionForm
      defaultValues={transaction}
      onSubmit={onSubmit}
      loading={createTransactionMutation.isPending}
      submitText="Criar"
    />
  );
}
