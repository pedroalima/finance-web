import { View, StyleSheet, FlatList, Pressable } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Transaction } from "@/src/types/transactions";
import { ActivityIndicator, FAB, Text, Surface } from "react-native-paper";
import styles from "@/src/styles/global";
import { useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { getAllTransactions } from "@/src/service/transactionsService";
import { formatDateToFront, generateMonths } from "@/src/utils/date";
import { useEffect, useRef, useState } from "react";

export default function Transactions() {
  const route = useRouter();
  const listRef = useRef<FlatList>(null);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const {
    data: transactions,
    isLoading,
    isError,
    isFetched,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => getAllTransactions(),
  });

  // calcula o índice do mês atual
  const months = generateMonths(2); // últimos 24 meses

  const initialMonthIndex = months.findIndex(
    (m) => m.month === currentMonth && m.year === currentYear
  );

  // toda vez que transactions mudar, reposiciona o FlatList
  useEffect(() => {
    if (listRef.current && initialMonthIndex >= 0) {
      listRef.current.scrollToIndex({
        index: initialMonthIndex,
        animated: true,
      });
    }
  }, [transactions, initialMonthIndex]);

  if (isLoading) {
    return (
      <Surface style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator animating size="large" />
      </Surface>
    );
  }

  if (!isFetched) {
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

  const brDateToSortKey = (s: string) => {
    const [d, m, y] = s.split("/").map(Number);
    return y * 10000 + m * 100 + d;
  };

  // Filtrar transações pelo mês/ano selecionados
  const filteredTransactions: Transaction[] = (transactions ?? []).filter(
    (t: Transaction) => {
      const d = new Date(t.date);
      return (
        d.getMonth() + 1 === selectedMonth && d.getFullYear() === selectedYear
      );
    }
  );

  // Agrupar transações por data
  const groupedTransactions: Record<string, Transaction[]> =
    filteredTransactions.reduce(
      (acc: Record<string, Transaction[]>, transaction: Transaction) => {
        const date = formatDateToFront(transaction.date);

        if (!acc[date]) {
          acc[date] = [];
        }
        acc[date].push(transaction);
        return acc;
      },
      {}
    );

  // Criar sections ordenadas
  type Section = { date: string; data: Transaction[] };

  const sections: Section[] =
    filteredTransactions.length > 0
      ? Object.keys(groupedTransactions)
          .map((date) => ({
            date,
            data: groupedTransactions[date],
          }))
          .sort((a, b) => brDateToSortKey(b.date) - brDateToSortKey(a.date))
      : [];

  return (
    <View style={styles.fullScreenContainer}>
      {/* Mês selecionado */}
      <View style={{ height: 40, padding: 1 }}>
        <FlatList
          ref={listRef}
          data={months} // últimos 24 meses
          horizontal
          contentContainerStyle={styles.monthsContainer}
          showsHorizontalScrollIndicator={false}
          snapToInterval={104} // largura aproximada de 3 cards, ajuste conforme necessidade
          decelerationRate="fast"
          keyExtractor={(item) => `${item.month}-${item.year}`}
          initialScrollIndex={initialMonthIndex}
          getItemLayout={
            (data, index) => ({
              length: 80,
              offset: 80 * index,
              index,
            }) // necessário para initialScrollIndex funcionar
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => {
                setSelectedMonth(item.month);
                setSelectedYear(item.year);
              }}
              style={[
                styles.monthCard,
                item.month === selectedMonth && item.year === selectedYear
                  ? styles.monthCardActive
                  : null,
              ]}
            >
              <Text
                style={
                  item.month === selectedMonth && item.year === selectedYear
                    ? styles.monthTextActive
                    : styles.monthText
                }
              >
                {item.label}
              </Text>
            </Pressable>
          )}
        />
      </View>
      {/* Adicionado para garantir que ocupe a tela */}
      {transactions && transactions.length > 0 ? (
        <FlatList
          data={sections}
          keyExtractor={(item) => item.date}
          contentContainerStyle={styles.listContentContainer}
          renderItem={({ item: section }) => {
            // calcula total do dia
            const dailyTotal = section.data.reduce((acc, t) => {
              const value = Number(t.amount);
              return t.type_id === 2 ? acc - value : acc + value; // type_id=2 → despesa
            }, 0);

            return (
              <>
                {section.data.length > 0 && (
                  <View>
                    <Text style={styles.sectionHeader}>
                      {section.date.toUpperCase()},{" "}
                      {new Date(section.data[0].date)
                        .toLocaleDateString("pt-BR", { weekday: "long" })
                        .toUpperCase()}
                    </Text>

                    {section.data.map((item: Transaction) => (
                      <Pressable
                        key={item.id.toString()}
                        onPress={() =>
                          route.push({
                            pathname: "/(panel)/transactions/[id]/edit/page",
                            params: { id: item.id.toString() },
                          })
                        }
                        style={styles.card}
                      >
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
                            {item?.type_id === 2 ? "-" : "+"} R${" "}
                            {Number(item.amount).toFixed(2).replace(".", ",")}
                          </Text>
                        </View>

                        {/* total do dia (aparece em todas as transações do mesmo dia) */}
                        <View style={styles.dailyTotalContainer}>
                          <Text style={[styles.dailyTotalText]}>
                            {dailyTotal < 0 ? "-" : "+"} R${" "}
                            {Math.abs(dailyTotal).toFixed(2).replace(".", ",")}
                          </Text>
                        </View>
                      </Pressable>
                    ))}
                  </View>
                )}
              </>
            );
          }}
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
          route.push("/(panel)/transactions/create/page");
        }}
        color="#fff"
        customSize={56}
        variant="primary"
      />
    </View>
  );
}
