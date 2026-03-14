import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  type CreateTodoPayload,
} from "@/api/todo.api";
import type { LocalTodo, SyncStatus } from "@/store/localTodo";

/**
 * Upload every todo whose syncStatus === "pending".
 * - "local_*" ids → POST via createTodo, replace temp id with server id
 * - existing ids → PUT via updateTodo
 * Returns the updated todos array.
 */
export async function syncPending(todos: LocalTodo[]): Promise<LocalTodo[]> {
  const updated = [...todos];

  for (let i = 0; i < updated.length; i++) {
    const todo = updated[i];
    if (todo.syncStatus !== "pending") continue;

    const payload: CreateTodoPayload = {
      title: todo.title,
      description: todo.description,
      priority: todo.priority,
      status: todo.status,
    };

    try {
      if (todo.id.startsWith("local_")) {
        const serverTodo = await createTodo(payload);
        updated[i] = { ...serverTodo, syncStatus: "synced" };
      } else {
        await updateTodo(todo.id, payload);
        updated[i] = { ...todo, syncStatus: "synced" };
      }
    } catch {
      // Leave as "pending" — will retry on next sync
    }
  }

  return updated;
}

/**
 * DELETE every todo whose syncStatus === "deleted" from the server,
 * then remove them from the local list entirely.
 * "local_*" ids are dropped immediately with no network call.
 */
export async function syncDeleted(todos: LocalTodo[]): Promise<LocalTodo[]> {
  const toDelete = todos.filter((t) => t.syncStatus === "deleted");

  await Promise.allSettled(
    toDelete
      .filter((t) => !t.id.startsWith("local_"))
      .map((t) => deleteTodo(t.id))
  );

  return todos.filter((t) => t.syncStatus !== "deleted");
}

/**
 * Full sync cycle:
 * 1. Upload pending mutations
 * 2. Purge soft-deleted records
 * 3. Fetch authoritative server list
 * 4. Merge: server wins; any still-pending local_ items are kept
 */
export async function syncAll(todos: LocalTodo[]): Promise<LocalTodo[]> {
  let current = await syncPending(todos);
  current = await syncDeleted(current);

  const serverTodos = await getTodos();

  const stillPending = current.filter((t) => t.syncStatus === "pending");

  const merged: LocalTodo[] = [
    ...serverTodos.map((t) => ({ ...t, syncStatus: "synced" as SyncStatus })),
    ...stillPending,
  ];

  return merged;
}
