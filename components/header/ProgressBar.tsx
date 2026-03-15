import { LinearGradient } from "expo-linear-gradient";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

import { ThemeColors } from "@/constants/theme";
import { useAppTheme } from "@/context/ThemeContext";

type Props = {
  label?: string;
  completed: number;
  total: number;
};

export default function ProgressBar({
  label = "PROGRESS",
  completed,
  total,
}: Props) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.percentage}>{percentage}%</Text>
      </View>
      <View style={styles.track}>
        <LinearGradient
          colors={[colors.primary, colors.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.fill, { width: `${percentage}%` }]}
        />
      </View>
      <Text style={styles.subtext}>
        {completed} of {total} tasks completed
      </Text>
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 8,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    label: {
      fontSize: 12,
      fontWeight: "700",
      letterSpacing: 0.8,
      color: colors.gray700,
    },
    percentage: {
      fontSize: 14,
      fontWeight: "700",
      color: colors.primary,
    },
    track: {
      height: 12,
      borderRadius: 6,
      backgroundColor: colors.gray200,
      overflow: "hidden",
    },
    fill: {
      height: "100%",
      borderRadius: 6,
    },
    subtext: {
      fontSize: 12,
      color: colors.gray400,
    },
  });
}
