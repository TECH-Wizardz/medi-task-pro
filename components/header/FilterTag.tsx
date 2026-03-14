import { Pressable, StyleSheet, Text } from 'react-native';

import { Colors } from '@/constants/theme';

type Props = {
  label: string;
  active?: boolean;
  onPress?: () => void;
};

export default function FilterTag({ label, active = false, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tag, active ? styles.tagActive : styles.tagInactive]}>
      <Text style={[styles.label, active ? styles.labelActive : styles.labelInactive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tagActive: {
    backgroundColor: Colors.light.primary,
  },
  tagInactive: {
    backgroundColor: Colors.light.gray100,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  labelActive: {
    color: Colors.light.white,
  },
  labelInactive: {
    color: Colors.light.gray500,
  },
});
