import NetInfo from "@react-native-community/netinfo";
import { useEffect, useRef } from "react";

import { toast } from "@/components/ui/Toast";
import useTodoStore from "@/store/useTodoStore";

/**
 * Listens for network reconnection events. When the device comes back
 * online and there are pending/deleted todos, triggers a full sync and
 * shows a success or error toast.
 */
export function useAutoSync() {
  const syncWithServer = useTodoStore((s) => s.syncWithServer);
  const todos = useTodoStore((s) => s.todos);

  // Track previous connectivity so we only sync on transition offline → online
  const wasOnlineRef = useRef<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const isOnline =
        state.isConnected === true && state.isInternetReachable !== false;

      const justCameOnline = !wasOnlineRef.current && isOnline;
      wasOnlineRef.current = isOnline;

      if (!justCameOnline) return;

      const hasPending = todos.some(
        (t) => t.syncStatus === "pending" || t.syncStatus === "deleted"
      );
      if (!hasPending) return;

      syncWithServer()
        .then(() => toast.show("All tasks synced successfully", "success"))
        .catch(() => toast.show("Sync failed. Will retry when online.", "error"));
    });

    return unsubscribe;
  }, [todos, syncWithServer]);
}
