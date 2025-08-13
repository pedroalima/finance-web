import { View, StyleSheet, FlatList } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons"; // Importe ícones se for usar. Se não tiver, instale com `expo install @expo/vector-icons`
import { Transaction } from "@/src/types/transactions";
import { useTransactions } from "@/src/hooks/useTransactions";
import { ActivityIndicator, FAB, Text, Surface } from "react-native-paper";
import { formatDate } from "@/src/utils/date";
import styles from "@/src/styles/global";
import { useRouter } from "expo-router";

export default function Transactions() {
  const { data: transactions, isLoading, isError } = useTransactions();
  const route = useRouter();

  if (isLoading) {
    return (
      <Surface style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator animating size="large" />
      </Surface>
    );
  }

  if (isError) {
    return (
      <Surface
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>Erro ao carregar transações.</Text>
      </Surface>
    );
  }

  // Agrupar transações por data
  const groupedTransactions = (transactions ?? []).reduce(
    (acc, transaction) => {
      const date = formatDate(transaction.date); // Use a data formatada como chave
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(transaction);
      return acc;
    },
    {} as Record<string, Transaction[]>
  );

  // Criar um array de objetos para o FlatList, onde cada objeto representa um grupo de data
  const sections =
    transactions && transactions.length > 0
      ? Object.keys(groupedTransactions).map((date) => ({
          date,
          data: groupedTransactions[date],
        }))
      : [];

  return (
    <View style={styles.fullScreenContainer}>
      {/* Adicionado para garantir que ocupe a tela */}
      {transactions && transactions.length > 0 ? (
        <FlatList
          data={sections}
          keyExtractor={(item) => item.date}
          contentContainerStyle={styles.listContentContainer}
          renderItem={({ item: section }) => (
            <View>
              {section.data.length > 0 && (
                <>
                  <Text style={styles.sectionHeader}>
                    {section.date.toUpperCase()},{" "}
                    {new Date(section.data[0].date)
                      .toLocaleDateString("pt-BR", { weekday: "long" })
                      .toUpperCase()}
                  </Text>
                  {section.data.map((item: Transaction) => (
                    <View key={item.id.toString()} style={styles.card}>
                      <View style={styles.cardHeader}>
                        <View style={styles.iconContainer}>
                          <FontAwesome5
                            name="utensils"
                            size={20}
                            color="#555"
                          />
                        </View>
                        <View style={styles.detailsContainer}>
                          <Text style={styles.description}>
                            {item.description}
                          </Text>
                          <Text style={styles.categoryAccount}>
                            {item.category_id === 1
                              ? "Receitas"
                              : "Alimentação"}{" "}
                            |{" "}
                            {item.account_id === 1
                              ? "Cartão de Crédito - Nubank"
                              : "Carteira"}
                            {item.installment && item.installment_number
                              ? ` | Parcela ${item.installment_number}`
                              : ""}
                          </Text>
                        </View>
                        <Text
                          style={[
                            styles.amount,
                            item.type_id === 2
                              ? styles.expenseAmount
                              : styles.incomeAmount,
                          ]}
                        >
                          {item.type_id === 2 ? "-" : "+"} R${" "}
                          {item.amount.toFixed(2).replace(".", ",")}
                        </Text>
                      </View>
                      <View style={styles.dailyTotalContainer}>
                        {/* Exemplo de exibição do total, você precisaria calcular o valor real */}
                        <Text style={styles.dailyTotalText}>-R$ 766,41</Text>
                      </View>
                    </View>
                  ))}
                </>
              )}
            </View>
          )}
        />
      ) : (
        <Text style={styles.noTransactionsText}>
          Nenhuma transação encontrada.
        </Text>
      )}
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => {
          // Aqui você pode navegar para a tela de adicionar transação
          // navigatio.navigate('AddTransaction');
          route.push("/(panel)/transactions/create/page");
          console.log("Adicionar transação");
        }}
        color="#fff"
        customSize={56}
        variant="primary"
      />
    </View>
  );
}
