import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/theme";
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type ToastType = "success" | "error";

interface ToastEntry {
  message: string;
  type: ToastType;
  /** Monotonic id — changes on every show so repeated calls re-trigger animation */
  id: number;
}

const SLIDE_DURATION = 280;
const VISIBLE_DURATION = 3000;
const TOAST_HEIGHT = 56;

const TOAST_CONFIG = {
  success: { bg: Colors.light.success, icon: "checkmark-circle-outline" as const },
  error: { bg: Colors.light.error, icon: "alert-circle-outline" as const },
};

// Module-level handler — set when the Toast component mounts
let _handler: ((entry: ToastEntry) => void) | null = null;

/** Imperative toast API — call from anywhere without a store */
export const toast = {
  show(message: string, type: ToastType) {
    _handler?.({ message, type, id: Date.now() });
  },
};

export default function Toast() {
  const [entry, setEntry] = useState<ToastEntry | null>(null);
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(-(TOAST_HEIGHT + insets.top + 16));
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    _handler = setEntry;
    return () => {
      _handler = null;
    };
  }, []);

  const hideToast = () => setEntry(null);

  const slideIn = () => {
    translateY.value = withTiming(insets.top + 12, {
      duration: SLIDE_DURATION,
    });
  };

  const slideOut = (onDone: () => void) => {
    translateY.value = withTiming(
      -(TOAST_HEIGHT + insets.top + 16),
      { duration: SLIDE_DURATION },
      (finished) => {
        if (finished) runOnJS(onDone)();
      },
    );
  };

  useEffect(() => {
    if (!entry) return;

    if (timerRef.current) clearTimeout(timerRef.current);

    // Reset position before sliding in (handles rapid successive toasts)
    translateY.value = -(TOAST_HEIGHT + insets.top + 16);
    slideIn();

    timerRef.current = setTimeout(() => {
      slideOut(hideToast);
    }, VISIBLE_DURATION);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entry?.id]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (!entry) return null;

  const { bg, icon } = TOAST_CONFIG[entry.type];

  return (
    <Animated.View
      style={[styles.container, { backgroundColor: bg }, animatedStyle]}
      pointerEvents="none"
    >
      <View style={styles.inner}>
        <Ionicons name={icon} size={20} color={Colors.light.white} />
        <Text style={styles.message} numberOfLines={2}>
          {entry.message}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 9999,
    borderRadius: 12,
    minHeight: TOAST_HEIGHT,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8,
  },
  inner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: Colors.light.white,
  },
});
