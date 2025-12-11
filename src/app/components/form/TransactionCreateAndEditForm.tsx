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
  Pressable,
  TouchableOpacity,
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
import CustomPicker from "../utils/CustomPicker";

type SectionProps = {
  title: string;
  children: React.ReactNode;
};

const Section = ({ title, children }: any) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const FieldContainer = ({ children }: any) => (
  <View style={styles.fieldContainer}>{children}</View>
);

const ErrorText = ({ error }: any) =>
  error ? <Text style={styles.errorText}>{String(error)}</Text> : null;

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

  // ============================
  // AmountField
  // ============================
  const AmountField = ({ control, errors }: any) => (
    <Section title="Valor" style={{ display: "flex" }}>
      <View style={{ marginBottom: 8 }}>
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
              style={[styles.input, styles.amountInput]}
              placeholderTextColor="#999"
            />
          )}
        />

        <ErrorText error={errors.amount?.message} />
      </View>

      {/* Tipo*/}
      <View style={{ flexDirection: "row", gap: 12 }}>
        {/* Tipo */}
        <FieldContainer
          style={{ flex: 1, padding: 2, backgroundColor: "#c43a3a" }}
        >
          <Text style={styles.label}>Tipo</Text>
          <Controller
            control={control}
            name="type_id"
            rules={{ required: "O tipo é obrigatório" }}
            render={({ field: { onChange, value } }) => (
              <CustomPicker
                value={value}
                onChange={onChange}
                options={[
                  { label: "Despesa", value: TransactionTypes.Despesa },
                  { label: "Receita", value: TransactionTypes.Receita },
                  {
                    label: "Transferência",
                    value: TransactionTypes.Transferencia,
                  },
                ]}
              />
            )}
          />
          <ErrorText error={errors.type_id?.message} />
        </FieldContainer>

        {/* Data */}
        <FieldContainer style={{ flex: 1 }}>
          <Text style={styles.label}>Data</Text>
          <Controller
            control={control}
            name="date"
            rules={{ required: "A data é obrigatória" }}
            render={({ field: { onChange, value } }) => {
              const currentDate =
                value instanceof Date ? value : new Date(value ?? Date.now());

              return (
                <>
                  <Pressable
                    style={styles.dateButton}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <Text style={styles.dateText}>
                      {currentDate.toLocaleDateString("pt-BR")}
                    </Text>
                  </Pressable>

                  {showDatePicker && (
                    <DateTimePicker
                      value={currentDate}
                      mode="date"
                      display={Platform.OS === "ios" ? "spinner" : "default"}
                      onChange={(_, selectedDate) => {
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
          <ErrorText error={errors.date?.message} />
        </FieldContainer>
      </View>

      {/* SEGUNDA LINHA: Conta + Categoria */}
      <View style={{ flexDirection: "row", gap: 12, marginBottom: 16 }}>
        {/* Conta */}
        <FieldContainer style={{ flex: 1 }}>
          <Text style={styles.label}>Conta</Text>
          <Controller
            control={control}
            name="account_id"
            rules={{ required: "A conta é obrigatória" }}
            render={({ field: { onChange, value } }) => (
              <View style={styles.input}>
                <Picker
                  selectedValue={value}
                  onValueChange={onChange}
                  style={styles.input}
                >
                  <Picker.Item label="Selecione" value="" />
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
              </View>
            )}
          />
          <ErrorText error={errors.account_id?.message} />
        </FieldContainer>

        {/* Categoria */}
        <FieldContainer style={{ flex: 1 }}>
          <Text style={styles.label}>Categoria</Text>
          <Controller
            control={control}
            name="category_id"
            rules={{ required: "A categoria é obrigatória" }}
            render={({ field: { onChange, value } }) => (
              <View style={styles.input}>
                <Picker
                  selectedValue={value}
                  onValueChange={onChange}
                  style={styles.input}
                >
                  <Picker.Item label="Selecione" value="" />
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
              </View>
            )}
          />
          <ErrorText error={errors.category_id?.message} />
        </FieldContainer>
      </View>

      {/* TERCEIRA LINHA: Descrição */}
      <View>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <TextInput
              placeholder="Ex: Almoço no shopping"
              value={value?.toString() ?? ""}
              onChangeText={onChange}
              style={[styles.input, { height: 60 }]}
              multiline
            />
          )}
        />

        <ErrorText error={errors.description?.message} />
      </View>
    </Section>
  );

  const InstallmentSection = ({ control, watch }: any) => {
    const installment = watch("installment");

    return (
      <Section title="Parcelamento">
        <View style={styles.switchRow}>
          <Text style={styles.label}>É parcelado?</Text>
          <Controller
            control={control}
            name="installment"
            render={({ field: { onChange, value } }) => (
              <Switch
                value={value}
                onValueChange={onChange}
                thumbColor={value ? "#5E17EB" : "#ccc"}
              />
            )}
          />
        </View>

        {installment && (
          <View style={{ marginTop: 12 }}>
            <Text style={styles.label}>Número de parcelas</Text>
            <Controller
              control={control}
              name="installment_number"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  placeholder="Ex: 3"
                  keyboardType="numeric"
                  value={value?.toString() ?? ""}
                  onChangeText={onChange}
                  style={styles.input}
                />
              )}
            />
          </View>
        )}
      </Section>
    );
  };

  const FormActions = ({
    loading,
    submitText,
    handleSubmit,
    onSubmit,
    showDeleteButton,
    handleDeleteTransaction,
  }: any) => {
    if (loading) {
      return (
        <ActivityIndicator
          size="large"
          color="#5E17EB"
          style={{ marginVertical: 20 }}
        />
      );
    }

    return (
      <View style={styles.actionBar}>
        <Pressable style={styles.submitButton} onPress={handleSubmit(onSubmit)}>
          <Text style={styles.submitText}>{submitText}</Text>
        </Pressable>

        {showDeleteButton && (
          <Pressable
            style={styles.deleteButton}
            onPress={handleDeleteTransaction}
          >
            <Text style={styles.deleteText}>Excluir</Text>
          </Pressable>
        )}
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <AmountField control={control} errors={errors} />

      <InstallmentSection control={control} watch={watch} />

      <FormActions
        loading={loading}
        submitText={submitText}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        showDeleteButton={showDeleteButton}
        handleDeleteTransaction={handleDeleteTransaction}
      />
    </ScrollView>
  );
}
