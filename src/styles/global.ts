import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: "#F0F2F5", // Cor de fundo geral, semelhante à imagem
  },
  listContentContainer: {
    paddingVertical: 16,
    paddingHorizontal: 0, // Remover padding horizontal para as seções
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
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 12,
    paddingVertical: 4,
    paddingHorizontal: 2,
    fontSize: 16,
  },
  input_error: {
    borderBottomColor: "#E53935",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
});

export default styles;
