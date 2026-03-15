import Ionicons from '@expo/vector-icons/Ionicons';
import { useMemo } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { ThemeColors } from '@/constants/theme';
import { useAppTheme } from '@/context/ThemeContext';

type Props = {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmationModal({ visible, onConfirm, onCancel }: Props) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Ionicons name="trash-outline" size={32} color={colors.error} />
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

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.overlay,
    },
    card: {
      width: 280,
      borderRadius: 16,
      padding: 24,
      gap: 16,
      alignItems: 'center',
      backgroundColor: colors.cardBg,
    },
    title: {
      fontSize: 17,
      fontWeight: '700',
      color: colors.gray900,
    },
    message: {
      fontSize: 14,
      color: colors.gray500,
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
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.gray200,
    },
    cancelText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.gray700,
    },
    deleteButton: {
      backgroundColor: colors.error,
    },
    deleteText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.white,
    },
  });
}
