import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "#F0F2F5", // Cor de fundo geral, semelhante à imagem
  },
  listContentContainer: {
    paddingVertical: 16,
    paddingHorizontal: 0,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#F0F2F5", // Fundo igual ao do container principal para a header
  },
  card: {
    backgroundColor: "#fff", // Fundo branco para o card
    padding: 16,
    marginBottom: 10,
    marginHorizontal: 16, // Espaçamento lateral do card
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // Sombra para Android
    gap: 12, // Espaçamento entre os elementos dentro do card
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Espaçamento entre os elementos
    marginBottom: 8,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E0E0E0", // Cor de fundo do círculo do ícone
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  detailsContainer: {
    flex: 1,
    marginRight: 10,
  },
  description: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  categoryAccount: {
    fontSize: 13,
    color: "#777",
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  expenseAmount: {
    color: "#E53935", // Cor vermelha para despesas
  },
  incomeAmount: {
    color: "#4CAF50", // Cor verde para receitas (não mostrado na imagem, mas um bom padrão)
  },
  dailyTotalContainer: {
    alignItems: "flex-end", // Alinha o total diário à direita
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 8,
  },
  dailyTotalText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#555",
  },
  noTransactionsText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#888",
  },
  // Estilos antigos, alguns podem ser removidos ou substituídos pelos novos
  loader: {
    flex: 1,
    justifyContent: "center",
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: "#34313f",
  },
  button: {
    backgroundColor: "#34313f",
    padding: 10,
    borderRadius: 5,
    color: "#fff",
  },
  // input: {
  //   borderBottomWidth: 1,
  //   borderBottomColor: "#ccc",
  //   marginBottom: 12,
  //   paddingVertical: 4,
  //   paddingHorizontal: 2,
  //   fontSize: 16,
  // },
  input_error: {
    borderBottomColor: "#E53935",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  monthsContainer: {
    flexDirection: "row",
  },
  monthCard: {
    width: 80,
    padding: 8,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: "#ffffffff",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  monthCardActive: {
    backgroundColor: "#6200ee",
  },
  monthText: {
    color: "#333",
    fontSize: 14,
  },
  monthTextActive: {
    color: "#fff",
    fontWeight: "bold",
  },

  section: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },

  fieldContainer: {
    flex: 1,
  },

  label: {
    marginBottom: 6,
    color: "#555",
    fontWeight: "500",
  },

  input: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#FAFAFA",
  },

  amountInput: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    height: 60,
  },

  errorText: {
    color: "red",
    marginTop: 4,
    fontSize: 12,
  },

  dateButton: {
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#FAFAFA",
  },

  dateText: {
    color: "#333",
    fontWeight: "500",
  },

  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  actionBar: {
    gap: 12,
    marginTop: 8,
    marginBottom: 40,
  },

  submitButton: {
    backgroundColor: "#5E17EB",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  submitText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },

  deleteButton: {
    backgroundColor: "#FF3B30",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  },

  deleteText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default styles;
