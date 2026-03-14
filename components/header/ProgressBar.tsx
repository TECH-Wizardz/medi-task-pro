import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";

import { Colors } from "@/constants/theme";

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
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.percentage}>{percentage}%</Text>
      </View>
      <View style={styles.track}>
        <LinearGradient
          colors={[Colors.light.primary, Colors.light.primaryLight]}
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

const styles = StyleSheet.create({
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
    color: Colors.light.gray700,
  },
  percentage: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.light.primary,
  },
  track: {
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.light.gray200,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 6,
  },
  subtext: {
    fontSize: 12,
    color: Colors.light.gray400,
  },
});
