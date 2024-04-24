import { AppStackParamList, AppStackNavigationProp } from "./AppNavigator"
import { useNavigation } from "@react-navigation/native"

export function useTypedNavigation<T extends keyof AppStackParamList>() {
  return useNavigation<AppStackNavigationProp<T>>()
}
