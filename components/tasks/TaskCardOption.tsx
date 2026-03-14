import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppColors } from '@/constants/theme';

type Props = {
  visible: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
};

export default function TaskCardOption({ visible, onEdit, onDelete, onClose }: Props) {
  if (!visible) return null;
  return (
    <>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <View style={styles.dropdown}>
        <Pressable style={styles.row} onPress={onEdit}>
          <Ionicons name="create-outline" size={18} color={AppColors.gray500} />
          <Text style={styles.rowText}>Edit</Text>
        </Pressable>
        <View style={styles.separator} />
        <Pressable style={styles.row} onPress={onDelete}>
          <Ionicons name="trash-outline" size={18} color={AppColors.error} />
          <Text style={[styles.rowText, styles.deleteText]}>Delete</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  dropdown: {
    position: 'absolute',
    top: 36,
    right: 0,
    minWidth: 150,
    zIndex: 2,
    backgroundColor: AppColors.cardBg,
    borderRadius: 10,
    elevation: 4,
    shadowColor: AppColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    borderWidth: 1,
    borderColor: AppColors.slate100,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  rowText: {
    fontSize: 14,
    fontWeight: '500',
    color: AppColors.gray900,
  },
  deleteText: {
    color: AppColors.error,
  },
  separator: {
    height: 1,
    backgroundColor: AppColors.slate100,
  },
});
