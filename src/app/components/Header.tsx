import { Appbar } from "react-native-paper";
import type { NativeStackHeaderProps } from "@react-navigation/native-stack";

export default function Header({
  navigation,
  route,
  options,
  back,
}: NativeStackHeaderProps) {
  return (
    <Appbar.Header>
      {/* Botão de voltar, se tiver */}
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}

      <Appbar.Content title={options.title ?? route.name} />

      {/* Botão à direita */}
      <Appbar.Action icon="dots-vertical" onPress={() => {}} />
    </Appbar.Header>
  );
}
