import type { Todo } from "@/api/todo.api";

export type SyncStatus = "synced" | "pending" | "deleted";

export type LocalTodo = Todo & {
  syncStatus: SyncStatus;
};
