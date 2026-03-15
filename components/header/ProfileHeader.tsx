import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { toast } from "@/components/ui/Toast";
import { AppColors, Colors } from "@/constants/theme";
import { useAutoSync } from "@/hooks/use-auto-sync";
import useTodoStore from "@/store/useTodoStore";
import { getGreeting } from "@/utils/getGreeting.util";

export default function ProfileHeader() {
  useAutoSync();

  const todos = useTodoStore((s) => s.todos);
  const isLoading = useTodoStore((s) => s.isLoading);
  const syncWithServer = useTodoStore((s) => s.syncWithServer);

  const hasPending = todos.some(
    (t) => t.syncStatus === "pending" || t.syncStatus === "deleted",
  );
  const isSyncing = hasPending || isLoading;

  const rotation = useSharedValue(0);

  useEffect(() => {
    if (isLoading) {
      rotation.value = withRepeat(
        withTiming(360, { duration: 1200, easing: Easing.linear }),
        -1,
      );
    } else {
      cancelAnimation(rotation);
      rotation.value = 0;
    }
    // rotation is a stable shared value ref — safe to omit from deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  async function handleManualSync() {
    try {
      await syncWithServer();
      toast.show("All tasks synced successfully", "success");
    } catch {
      toast.show("Sync failed. Will retry when online.", "error");
    }
  }

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/icons/profile.png")}
        style={styles.avatar}
        contentFit="cover"
      />
      <View style={styles.textContainer}>
        <Text style={styles.greeting}>{getGreeting()}</Text>
        <Text style={styles.name}>Dr. Nimal</Text>
      </View>

      <Pressable
        style={styles.syncBadge}
        onPress={hasPending ? handleManualSync : undefined}
        hitSlop={8}
        disabled={isLoading}
      >
        {isSyncing ? (
          <Animated.View style={spinStyle}>
            <Ionicons name="sync-outline" size={24} color={AppColors.warning} />
          </Animated.View>
        ) : (
          <Ionicons
            name="cloud-done-outline"
            size={24}
            color={AppColors.success}
          />
        )}
      </Pressable>
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
  },
  syncBadge: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
});
