import {
  BottomNavigation,
  MD3DarkTheme,
  PaperProvider,
} from "react-native-paper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
export type MaterialCommunityIconsGlyphs =
  keyof typeof MaterialCommunityIcons.glyphMap;
import Header from "./components/Header";
import { Stack } from "expo-router";
const queryClient = new QueryClient();

const theme = {
  ...MD3DarkTheme,
  roundness: 2,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#3498db",
    secondary: "#f1c40f",
    tertiary: "#a1b2c3",
  },
};

export interface RoutesType {
  key: string;
  title: string;
  icon: MaterialCommunityIconsGlyphs;
}

export default function MainLayout() {
  return (
    <PaperProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />

          <Stack.Screen
            name="(panel)/dashboard/page"
            options={{
              header: (props) => <Header {...props} />,
              title: "Dashboard",
            }}
          />
          <Stack.Screen
            name="(panel)/transactions/page"
            options={{
              header: (props) => <Header {...props} />,
              title: "Transações",
            }}
          />
          <Stack.Screen
            name="(panel)/transactions/create/page"
            options={{
              header: (props) => <Header {...props} />,
              title: "Criar Transação",
            }}
          />
          <Stack.Screen
            name="(panel)/settings/page"
            options={{
              header: (props) => <Header {...props} />,
              title: "Configurações",
            }}
          />
        </Stack>
      </QueryClientProvider>
    </PaperProvider>
  );
}
