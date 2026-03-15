import Ionicons from '@expo/vector-icons/Ionicons';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { AppColors } from '@/constants/theme';

type Props = {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmationModal({ visible, onConfirm, onCancel }: Props) {
  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Ionicons name="trash-outline" size={32} color={AppColors.error} />
          <Text style={styles.title}>Delete Task</Text>
          <Text style={styles.message}>Are you sure you want to delete this task?</Text>
          <View style={styles.buttonRow}>
            <Pressable style={[styles.button, styles.cancelButton]} onPress={onCancel}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.deleteButton]} onPress={onConfirm}>
              <Text style={styles.deleteText}>Delete</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: AppColors.overlay,
  },
  card: {
    width: 280,
    borderRadius: 16,
    padding: 24,
    gap: 16,
    alignItems: 'center',
    backgroundColor: AppColors.cardBg,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: AppColors.gray900,
  },
  message: {
    fontSize: 14,
    color: AppColors.gray500,
    textAlign: 'center',
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.gray200,
  },
  cancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.gray700,
  },
  deleteButton: {
    backgroundColor: AppColors.error,
  },
  deleteText: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.white,
  },
});
