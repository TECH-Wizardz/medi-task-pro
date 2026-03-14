import { Colors } from "@/constants/theme";
import { Tabs } from "expo-router";
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.tint,
        headerShown: false,
        tabBarStyle: { display: "none" },
      }}
    >
      <Tabs.Screen name="index" />
    </Tabs>
  );
}
