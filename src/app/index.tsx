import { View, Text, Pressable, StyleSheet } from "react-native";
import { Link } from "expo-router";
import styles from "../styles/global";

export default function Home() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home</Text>
      <Link href="/(panel)/dashboard/page" style={styles.button}>
        Ir para Dashboard
      </Link>
    </View>
  );
}
