import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/theme";

// Returns time-based greeting string
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "Good Morning,";
  if (hour >= 12 && hour < 17) return "Good Afternoon,";
  if (hour >= 17 && hour < 21) return "Good Evening,";
  return "Good Night,";
}

export default function ProfileHeader() {
  const isSyncing = false;

  return (
    <View style={styles.container}>
      {/* Profile avatar — replace source with dynamic user image URI when auth is ready */}
      <Image
        source={require("@/assets/icons/profile.png")}
        style={styles.avatar}
        contentFit="cover"
      />

      <View style={styles.textContainer}>
        {/* Greeting changes based on time of day */}
        <Text style={styles.greeting}>{getGreeting()}</Text>

        {/* TODO: replace "Dr. Nimal" with user name from auth/store */}
        <Text style={styles.name}>Dr. Nimal</Text>
      </View>

      {/* Sync status badge — shows spinner when syncing, cloud-done when idle */}
      <View style={styles.syncBadge}>
        {isSyncing ? (
          // TODO: wrap in Animated.View with rotation animation while syncing
          <Ionicons
            name="sync-outline"
            size={24}
            color={Colors.light.warning}
          />
        ) : (
          <Ionicons
            name="cloud-done-outline"
            size={24}
            color={Colors.light.success}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  textContainer: {
    flex: 1,
    flexDirection: "column",
  },
  greeting: {
    fontSize: 14,
    color: Colors.light.icon,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.light.text,
  },
  syncBadge: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
});
