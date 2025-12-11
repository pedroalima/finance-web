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
    refetchOnWindowFocus: true,
    staleTime: Infinity,
  });

  // calcula o índice do mês atual
  const months = generateMonths(); // últimos 24 meses

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
          .sort((a, b) => brDateToSortKey(a.date) - brDateToSortKey(b.date))
      : [];

  // ============================
  // MonthSelector (INLINE)
  // ============================
  const MonthSelector = ({
    listRef,
    months,
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    setSelectedYear,
    initialMonthIndex,
    styles,
  }: any) => {
    return (
      <View style={{ height: 40, padding: 1 }}>
        <FlatList
          ref={listRef}
          data={months}
          horizontal
          contentContainerStyle={styles.monthsContainer}
          showsHorizontalScrollIndicator={false}
          snapToInterval={104}
          decelerationRate="fast"
          keyExtractor={(item) => `${item.month}-${item.year}`}
          initialScrollIndex={initialMonthIndex}
          getItemLayout={(data, index) => ({
            length: 80,
            offset: 80 * index,
            index,
          })}
          renderItem={({ item }) => {
            const isActive =
              item.month === selectedMonth && item.year === selectedYear;

            return (
              <Pressable
                onPress={() => {
                  setSelectedMonth(item.month);
                  setSelectedYear(item.year);
                }}
                style={[styles.monthCard, isActive && styles.monthCardActive]}
              >
                <Text
                  style={isActive ? styles.monthTextActive : styles.monthText}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>
    );
  };

  // ============================
  // TransactionCard (INLINE)
  // ============================
  const TransactionCard = ({ item, dailyTotal, route, styles }: any) => {
    return (
      <Pressable
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
            <FontAwesome5 name="utensils" size={20} color="#555" />
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.description}>{item.description}</Text>

            <Text style={styles.categoryAccount}>
              {item.category_id === 1 ? "Receitas" : "Alimentação"}
              {" | "}
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
              item.type_id === 2 ? styles.expenseAmount : styles.incomeAmount,
            ]}
          >
            {item.type_id === 2 ? "-" : "+"} R${" "}
            {Number(item.amount).toFixed(2).replace(".", ",")}
          </Text>
        </View>

        <View style={styles.dailyTotalContainer}>
          <Text style={styles.dailyTotalText}>
            R$ {Math.abs(item.running_total).toFixed(2).replace(".", ",")}
          </Text>
        </View>
      </Pressable>
    );
  };

  // ============================
  // TransactionSection (INLINE)
  // ============================
  const TransactionSection = ({ section, route, styles }: any) => {
    if (section.data.length === 0) return null;

    const dailyTotal = section.data.reduce((acc: number, t: any) => {
      const value = Number(t.amount);
      return t.type_id === 2 ? acc - value : acc + value;
    }, 0);

    const weekday = new Date(section.data[0].date)
      .toLocaleDateString("pt-BR", {
        weekday: "long",
      })
      .toUpperCase();

    return (
      <View>
        <Text style={styles.sectionHeader}>
          {section.date.toUpperCase()}, {weekday}
        </Text>

        {section.data.map((item: any) => (
          <TransactionCard
            key={item.id}
            item={item}
            dailyTotal={dailyTotal}
            route={route}
            styles={styles}
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.fullScreenContainer}>
      <MonthSelector
        listRef={listRef}
        months={months}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        setSelectedMonth={setSelectedMonth}
        setSelectedYear={setSelectedYear}
        initialMonthIndex={initialMonthIndex}
        styles={styles}
      />

      {transactions && transactions.length > 0 ? (
        <FlatList
          data={sections}
          keyExtractor={(item) => item.date}
          contentContainerStyle={styles.listContentContainer}
          renderItem={({ item: section }) => (
            <TransactionSection
              section={section}
              route={route}
              styles={styles}
            />
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
        onPress={() => route.push("/(panel)/transactions/create/page")}
        color="#fff"
        customSize={56}
        variant="primary"
      />
    </View>
  );
}
