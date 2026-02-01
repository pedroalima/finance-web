import { useState } from "react";
import { RoutesType } from "../../_layout";
import Transactions from "../transactions/page";
import Settings from "../settings/page";
import { BottomNavigation } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Dashboard() {
  const [index, setIndex] = useState(0);

  const routes: RoutesType[] = [
    { key: "transactions", title: "Transações", icon: "wallet" },
    { key: "settings", title: "Configurações", icon: "cog" },
  ];

  const renderScene = ({ route }: { route: RoutesType }) => {
    switch (route.key) {
      case "transactions":
        return <Transactions />;
      case "settings":
        return <Settings />;
      default:
        return null;
    }
  };

  return (
    <>
      {renderScene({ route: routes[index] })}

      <BottomNavigation.Bar
        navigationState={{ index, routes }}
        activeColor="#3498db"
        onTabPress={({ route }) => {
          const newIndex = routes.findIndex((r) => r.key === route.key);
          if (newIndex !== -1) {
            setIndex(newIndex);
          }
        }}
        renderIcon={({ route, color }) => (
          <MaterialCommunityIcons name={route.icon} size={24} color={color} />
        )}
        getLabelText={({ route }) => route.title}
      />
    </>
  );
}
