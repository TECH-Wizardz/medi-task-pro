import RNToast from "react-native-toast-message";

export type ToastType = "success" | "error";

/** Imperative toast API — call from anywhere */
export const toast = {
  show(message: string, type: ToastType) {
    RNToast.show({ type, text1: message });
  },
};

export default RNToast;
