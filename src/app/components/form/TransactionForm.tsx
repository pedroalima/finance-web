// src/components/TransactionForm.tsx
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Switch,
  Button,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Controller, useForm } from "react-hook-form";
import styles from "@/src/styles/global";
import {
  TransactionAccountTypes,
  TransactionCategoryTypes,
  TransactionTypes,
} from "@/src/enums/transactions";
import { ActivityIndicator } from "react-native-paper";
import { formatCurrency } from "@/src/utils/date";

type Props = {
  defaultValues: any;
  onSubmit: (data: any) => void;
  loading?: boolean;
  submitText?: string;
  showDeleteButton?: boolean;
  handleDeleteTransaction?: () => void;
};

export default function TransactionForm({
  defaultValues,
  onSubmit,
  loading = false,
  submitText = "Salvar",
  showDeleteButton = false,
  handleDeleteTransaction,
}: Props) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ defaultValues });

  const installment = watch("installment");

  return (
    <ScrollView
      style={styles.fullScreenContainer}
      contentContainerStyle={{ padding: 16 }}
    >
      <View style={styles.card}>
        {/* Valor */}
        <View>
          <Text style={styles.description}>Valor</Text>
          <Controller
            control={control}
            name="amount"
            rules={{ required: "O valor é obrigatório" }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="R$ 0,00"
                keyboardType="numeric"
                value={value?.toString() ?? ""}
                onChangeText={(text) => onChange(formatCurrency(text))}
                style={styles.input}
              />
            )}
          />
          {errors.amount?.message && (
            <Text style={{ color: "red" }}>
              {String(errors.amount.message)}
            </Text>
          )}
        </View>

        {/* Tipo */}
        <View>
          <Text style={styles.description}>Tipo</Text>
          <Controller
            control={control}
            name="type_id"
            rules={{ required: "O tipo é obrigatório" }}
            render={({ field: { onChange, value } }) => (
              <Picker
                selectedValue={value}
                onValueChange={onChange}
                style={styles.input}
              >
                <Picker.Item label="Selecione o tipo" value="" />
                <Picker.Item label="Despesa" value={TransactionTypes.Despesa} />
                <Picker.Item label="Receita" value={TransactionTypes.Receita} />
                <Picker.Item
                  label="Transferência"
                  value={TransactionTypes.Transferencia}
                />
              </Picker>
            )}
          />
          {errors.type_id?.message && (
            <Text style={{ color: "red" }}>
              {String(errors.type_id.message)}
            </Text>
          )}
        </View>

        {/* Data */}
        <View>
          <Text style={styles.description}>Data</Text>
          <Controller
            control={control}
            name="date"
            rules={{ required: "A data é obrigatória" }}
            render={({ field: { onChange, value } }) => {
              const currentDate =
                value instanceof Date ? value : new Date(value ?? Date.now());

              return (
                <>
                  <Button
                    title={currentDate.toLocaleDateString("pt-BR")}
                    onPress={() => setShowDatePicker(true)}
                  />
                  {showDatePicker && (
                    <DateTimePicker
                      value={currentDate}
                      mode="date"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      onChange={(event, selectedDate) => {
                        setShowDatePicker(Platform.OS === "ios");
                        if (selectedDate) {
                          onChange(selectedDate);
                        }
                      }}
                    />
                  )}
                </>
              );
            }}
          />
          {errors.date?.message && (
            <Text style={{ color: "red" }}>{String(errors.date.message)}</Text>
          )}
        </View>

        {/* Descrição */}
        <View>
          <Text style={styles.description}>Descrição</Text>
          <Controller
            control={control}
            name="description"
            rules={{ required: "A descrição é obrigatória" }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                placeholder="Descrição"
                value={value?.toString() ?? ""}
                onChangeText={onChange}
                style={styles.input}
              />
            )}
          />
          {errors.description?.message && (
            <Text style={{ color: "red" }}>
              {String(errors.description.message)}
            </Text>
          )}
        </View>

        {/* Conta */}
        <View>
          <Text style={styles.description}>Conta</Text>
          <Controller
            control={control}
            name="account_id"
            rules={{ required: "A conta é obrigatória" }}
            render={({ field: { onChange, value } }) => (
              <Picker
                selectedValue={value}
                onValueChange={onChange}
                style={styles.input}
              >
                <Picker.Item label="Selecione a conta" value="" />
                <Picker.Item
                  label="Carteira"
                  value={TransactionAccountTypes.Carteira}
                />
                <Picker.Item
                  label="Conta Corrente"
                  value={TransactionAccountTypes["Conta Corrente"]}
                />
                <Picker.Item
                  label="Cartão de Crédito"
                  value={TransactionAccountTypes["Cartão de Crédito"]}
                />
              </Picker>
            )}
          />
          {errors.account_id?.message && (
            <Text style={{ color: "red" }}>
              {String(errors.account_id.message)}
            </Text>
          )}
        </View>

        {/* Categoria */}
        <View>
          <Text style={styles.description}>Categoria</Text>
          <Controller
            control={control}
            name="category_id"
            rules={{ required: "A categoria é obrigatória" }}
            render={({ field: { onChange, value } }) => (
              <Picker
                selectedValue={value}
                onValueChange={onChange}
                style={styles.input}
              >
                <Picker.Item label="Selecione a categoria" value="" />
                <Picker.Item
                  label="Alimentação"
                  value={TransactionCategoryTypes.Alimentação}
                />
                <Picker.Item
                  label="Lazer"
                  value={TransactionCategoryTypes.Lazer}
                />
                <Picker.Item
                  label="Moto"
                  value={TransactionCategoryTypes.Moto}
                />
              </Picker>
            )}
          />
          {errors.category_id?.message && (
            <Text style={{ color: "red" }}>
              {String(errors.category_id.message)}
            </Text>
          )}
        </View>

        {/* Parcelado */}
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

        {/* Número de parcelas */}
        {installment && (
          <View>
            <Text style={styles.description}>Número de Parcelas</Text>
            <Controller
              control={control}
              name="installment_number"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Ex.: 3"
                  keyboardType="numeric"
                  value={value?.toString() ?? ""}
                  onChangeText={onChange}
                  style={styles.input}
                />
              )}
            />
          </View>
        )}

        {/* Botão de ação */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#6200ee"
            style={{ marginTop: 20 }}
          />
        ) : (
          <>
            <Button
              title={submitText}
              color="#34313f"
              onPress={handleSubmit(onSubmit)}
            />
            {showDeleteButton && (
              <Button
                title="Excluir"
                color="#FF0000"
                onPress={handleDeleteTransaction}
              />
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
}
