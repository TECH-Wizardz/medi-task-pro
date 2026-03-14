import TaskCardOption from "@/components/tasks/TaskCardOption";
import { toast } from "@/components/ui/Toast";
import { AppColors } from "@/constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

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

const PRIORITY_STYLES: Record<
  Priority,
  { bg: string; text: string; border: string }
> = {
  HIGH: { bg: AppColors.errorBg, text: AppColors.error, border: AppColors.error },
  MEDIUM: { bg: AppColors.warningBg, text: AppColors.warning, border: AppColors.warning },
  LOW: { bg: AppColors.successBg, text: AppColors.success, border: AppColors.success },
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  Patients: { bg: AppColors.primaryBg, text: AppColors.primary },
  Personal: { bg: AppColors.purpleBg, text: AppColors.purple },
  Work: { bg: AppColors.orangeBg, text: AppColors.orange },
};

const TIMING = { duration: 250 };

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
  const [expanded, setExpanded] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const progress = useSharedValue(0);
  const checkProgress = useSharedValue(completed ? 1 : 0);
  const p = PRIORITY_STYLES[priority];
  const catStyle = category
    ? (CATEGORY_COLORS[category] ?? { bg: AppColors.gray100, text: AppColors.gray500 })
    : null;

  function toggle() {
    const next = !expanded;
    setExpanded(next);
    progress.value = withTiming(next ? 1 : 0, TIMING);
  }

  function toggleCheck() {
    checkProgress.value = withTiming(completed ? 0 : 1, TIMING);
    onToggle(id);
    toast.show(
      completed ? "Task marked incomplete" : "Task completed!",
      "success",
    );
  }

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

  const hasFooter = category || dueDate || owner;

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.badge, { backgroundColor: p.bg }]}>
          <Text style={[styles.badgeText, { color: p.text }]}>{priority}</Text>
        </View>
        <View style={styles.actions}>
          {description ? (
            <Pressable onPress={toggle} hitSlop={8}>
              <Animated.View style={chevronStyle}>
                <Ionicons name="chevron-down" size={20} color={AppColors.gray400} />
              </Animated.View>
            </Pressable>
          ) : null}
          <Pressable onPress={() => setMenuOpen(true)} hitSlop={8}>
            <Ionicons name="ellipsis-vertical" size={20} color={AppColors.gray400} />
          </Pressable>
        </View>
      </View>
      <TaskCardOption
        visible={menuOpen}
        onClose={() => setMenuOpen(false)}
        onEdit={() => {
          setMenuOpen(false);
          onEdit(id);
        }}
        onDelete={() => {
          setMenuOpen(false);
          onDelete(id);
          toast.show("Task deleted", "success");
        }}
      />

      {/* Title */}
      <View style={styles.titleRow}>
        <Pressable onPress={toggleCheck} hitSlop={8}>
          <View style={[styles.checkbox, completed && styles.checkboxChecked]}>
            <Animated.View style={checkFillStyle}>
              <Ionicons name="checkmark" size={13} color={AppColors.white} />
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
              style={[styles.categoryChip, { backgroundColor: catStyle.bg }]}
            >
              <Text style={[styles.categoryText, { color: catStyle.text }]}>
                {category}
              </Text>
            </View>
          ) : null}
          {dueDate ? (
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={12} color={AppColors.gray400} />
              <Text style={styles.metaText}>{formatDate(dueDate)}</Text>
            </View>
          ) : null}
          {owner ? (
            <View style={styles.metaItem}>
              <Ionicons name="person-outline" size={12} color={AppColors.gray400} />
              <Text style={styles.metaText}>{owner}</Text>
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "relative",
    backgroundColor: AppColors.cardBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppColors.slate100,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    gap: 10,
    shadowColor: AppColors.shadow,
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
    paddingVertical: 3,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: AppColors.gray300,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: AppColors.success,
    borderColor: AppColors.success,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    color: AppColors.gray900,
    flexShrink: 1,
  },
  titleCompleted: {
    textDecorationLine: "line-through",
    color: AppColors.gray400,
  },
  descriptionBlock: {
    borderLeftWidth: 3,
    borderRadius: 6,
    paddingLeft: 10,
    marginTop: 2,
  },
  description: {
    fontSize: 13,
    lineHeight: 20,
    color: AppColors.gray500,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    paddingTop: 2,
    borderTopWidth: 1,
    borderTopColor: AppColors.slate100,
  },
  categoryChip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "600",
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  metaText: {
    fontSize: 11,
    color: AppColors.gray400,
  },
});
