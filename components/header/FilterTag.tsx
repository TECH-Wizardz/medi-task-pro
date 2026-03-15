import { useMemo } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

import { ThemeColors } from "@/constants/theme";
import { useAppTheme } from "@/context/ThemeContext";

type Props = {
  label: string;
  active?: boolean;
  onPress?: () => void;
};

export default function FilterTag({ label, active = false, onPress }: Props) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Pressable
      onPress={onPress}
      style={[styles.tag, active ? styles.tagActive : styles.tagInactive]}
    >
      <Text
        style={[styles.label, active ? styles.labelActive : styles.labelInactive]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    tag: {
      paddingHorizontal: 18,
      paddingVertical: 8,
      borderRadius: 20,
    },
    tagActive: {
      backgroundColor: colors.primary,
    },
    tagInactive: {
      backgroundColor: colors.gray100,
    },
    label: {
      fontSize: 14,
      fontWeight: "500",
    },
    labelActive: {
      color: colors.white,
    },
    labelInactive: {
      color: colors.gray500,
    },
  });
}
