import NetInfo from "@react-native-community/netinfo";
import { useEffect, useRef } from "react";

import { toast } from "@/components/ui/Toast";
import useTodoStore from "@/store/useTodoStore";

/**
 * Listens for network reconnection events and pending todo changes.
 * - Syncs on offline → online transition if there are pending/deleted todos.
 * - Also syncs immediately when todos become pending while already online.
 */
export function useAutoSync() {
  const syncWithServer = useTodoStore((s) => s.syncWithServer);
  const todos = useTodoStore((s) => s.todos);

  // Track previous connectivity so we only sync on transition offline → online
  const wasOnlineRef = useRef<boolean | null>(null);
  const isOnlineRef = useRef<boolean>(false);
  const isSyncingRef = useRef<boolean>(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const isOnline =
        state.isConnected === true && state.isInternetReachable !== false;

      isOnlineRef.current = isOnline;

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

  // Sync when pending tasks appear while already online
  useEffect(() => {
    if (!isOnlineRef.current) return;
    if (isSyncingRef.current) return;

    const hasPending = todos.some(
      (t) => t.syncStatus === "pending" || t.syncStatus === "deleted"
    );
    if (!hasPending) return;

    isSyncingRef.current = true;
    syncWithServer()
      .then(() => toast.show("All tasks synced successfully", "success"))
      .catch(() => toast.show("Sync failed. Will retry when online.", "error"))
      .finally(() => { isSyncingRef.current = false; });
  }, [todos, syncWithServer]);
}
