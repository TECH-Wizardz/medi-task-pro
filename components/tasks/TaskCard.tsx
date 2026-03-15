import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo, useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import { ThemeColors } from "@/constants/theme";
import { useAppTheme } from "@/context/ThemeContext";

type Priority = "LOW" | "MEDIUM" | "HIGH";

type Props = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  category?: string;
  dueDate?: string;
  owner?: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
};

const TIMING = { duration: 250 };
const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.05;
const CLAMP = SWIPE_THRESHOLD * 2;

function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function TaskCard({
  id,
  title,
  description,
  completed,
  priority,
  category,
  dueDate,
  owner,
  onToggle,
  onDelete,
  onEdit,
}: Props) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const PRIORITY_STYLES: Record<
    Priority,
    { bg: string; text: string; border: string }
  > = {
    HIGH: { bg: colors.errorBg, text: colors.error, border: colors.error },
    MEDIUM: { bg: colors.warningBg, text: colors.warning, border: colors.warning },
    LOW: { bg: colors.successBg, text: colors.success, border: colors.success },
  };

  const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
    Patients: { bg: colors.primaryBg, text: colors.primary },
    Personal: { bg: colors.purpleBg, text: colors.purple },
    Work: { bg: colors.orangeBg, text: colors.orange },
  };

  const [expanded, setExpanded] = useState(false);
  const progress = useSharedValue(0);
  const checkProgress = useSharedValue(completed ? 1 : 0);
  const translateX = useSharedValue(0);
  const p = PRIORITY_STYLES[priority];
  const catStyle = category
    ? (CATEGORY_COLORS[category] ?? {
        bg: colors.gray100,
        text: colors.gray500,
      })
    : null;

  function toggle() {
    const next = !expanded;
    setExpanded(next);
    progress.value = withTiming(next ? 1 : 0, TIMING);
  }

  function toggleCheck() {
    checkProgress.value = withTiming(completed ? 0 : 1, TIMING);
    onToggle(id);
  }

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-15, 15])
    .onUpdate((e) => {
      translateX.value = Math.max(-CLAMP, Math.min(CLAMP, e.translationX));
    })
    .onEnd(() => {
      const tx = translateX.value;
      if (tx >= SWIPE_THRESHOLD) {
        translateX.value = withTiming(0, { duration: 220 });
        runOnJS(onEdit)(id);
      } else if (tx <= -SWIPE_THRESHOLD) {
        translateX.value = withTiming(0, { duration: 220 });
        runOnJS(onDelete)(id);
      } else {
        translateX.value = withTiming(0, { duration: 220 });
      }
    });

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${interpolate(progress.value, [0, 1], [0, 180])}deg` },
    ],
  }));

  const descStyle = useAnimatedStyle(() => ({
    maxHeight: interpolate(progress.value, [0, 1], [0, 200]),
    opacity: progress.value,
    overflow: "hidden",
  }));

  const checkFillStyle = useAnimatedStyle(() => ({
    opacity: checkProgress.value,
    transform: [{ scale: interpolate(checkProgress.value, [0, 1], [0.5, 1]) }],
  }));

  const cardAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const editBgAnimStyle = useAnimatedStyle(() => ({
    opacity: translateX.value > 0 ? 1 : 0,
  }));

  const deleteBgAnimStyle = useAnimatedStyle(() => ({
    opacity: translateX.value < 0 ? 1 : 0,
  }));

  const hasFooter = category || dueDate || owner;

  return (
    <View style={styles.swipeWrapper}>
      {/* Blue edit background — revealed on swipe right */}
      <Animated.View style={[styles.actionBg, styles.editBg, editBgAnimStyle]}>
        <Ionicons name="create-outline" size={22} color={colors.white} />
      </Animated.View>
      {/* Red delete background — revealed on swipe left */}
      <Animated.View
        style={[styles.actionBg, styles.deleteBg, deleteBgAnimStyle]}
      >
        <Ionicons name="trash-outline" size={22} color={colors.white} />
      </Animated.View>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.card, cardAnimStyle]}>
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.badge, { backgroundColor: p.bg }]}>
              <Text style={[styles.badgeText, { color: p.text }]}>
                {priority}
              </Text>
            </View>
            {description ? (
              <Pressable onPress={toggle} hitSlop={8}>
                <Animated.View style={chevronStyle}>
                  <Ionicons
                    name="chevron-down"
                    size={20}
                    color={colors.gray400}
                  />
                </Animated.View>
              </Pressable>
            ) : null}
          </View>

          {/* Title */}
          <View style={styles.titleRow}>
            <Pressable onPress={toggleCheck} hitSlop={8}>
              <View
                style={[styles.checkbox, completed && styles.checkboxChecked]}
              >
                <Animated.View style={checkFillStyle}>
                  <Ionicons
                    name="checkmark"
                    size={13}
                    color={colors.white}
                  />
                </Animated.View>
              </View>
            </Pressable>
            <Text style={[styles.title, completed && styles.titleCompleted]}>
              {title}
            </Text>
          </View>

          {/* Description (animated expand/collapse) */}
          {description ? (
            <Animated.View
              style={[
                styles.descriptionBlock,
                { borderLeftColor: p.border },
                descStyle,
              ]}
            >
              <Text style={styles.description}>{description}</Text>
            </Animated.View>
          ) : null}

          {/* Footer */}
          {hasFooter ? (
            <View style={styles.footer}>
              {category && catStyle ? (
                <View
                  style={[
                    styles.categoryChip,
                    { backgroundColor: catStyle.bg },
                  ]}
                >
                  <Text style={[styles.categoryText, { color: catStyle.text }]}>
                    {category}
                  </Text>
                </View>
              ) : null}
              {dueDate ? (
                <View style={styles.metaItem}>
                  <Ionicons
                    name="calendar-outline"
                    size={12}
                    color={colors.gray400}
                  />
                  <Text style={styles.metaText}>{formatDate(dueDate)}</Text>
                </View>
              ) : null}
              {owner ? (
                <View style={styles.metaItem}>
                  <Ionicons
                    name="person-outline"
                    size={12}
                    color={colors.gray400}
                  />
                  <Text style={styles.metaText}>{owner}</Text>
                </View>
              ) : null}
            </View>
          ) : null}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    swipeWrapper: {
      position: "relative",
      marginHorizontal: 16,
      marginVertical: 6,
      borderRadius: 12,
      overflow: "hidden",
    },
    actionBg: {
      position: "absolute",
      top: 0,
      bottom: 0,
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
    },
    editBg: {
      backgroundColor: colors.primary,
      justifyContent: "flex-start",
      gap: 4,
    },
    deleteBg: {
      backgroundColor: colors.error,
      justifyContent: "flex-end",
      gap: 4,
    },
    actionText: {
      color: colors.white,
      fontWeight: "700",
      fontSize: 14,
    },
    card: {
      backgroundColor: colors.cardBg,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.slate100,
      padding: 16,
      gap: 12,
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    badge: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 6,
    },
    badgeText: {
      fontSize: 11,
      fontWeight: "700",
      letterSpacing: 0.5,
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    checkbox: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.gray300,
      alignItems: "center",
      justifyContent: "center",
    },
    checkboxChecked: {
      backgroundColor: colors.success,
      borderColor: colors.success,
    },
    title: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.gray900,
      flexShrink: 1,
    },
    titleCompleted: {
      textDecorationLine: "line-through",
      color: colors.gray400,
    },
    descriptionBlock: {
      borderLeftWidth: 3,
      borderRadius: 6,
      paddingLeft: 12,
      paddingVertical: 6,
      marginTop: 2,
    },
    description: {
      fontSize: 13,
      lineHeight: 22,
      color: colors.gray500,
    },
    footer: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 8,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: colors.slate100,
    },
    categoryChip: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
    },
    categoryText: {
      fontSize: 11,
      fontWeight: "600",
    },
    metaItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    metaText: {
      fontSize: 11,
      color: colors.gray400,
    },
  });
}
