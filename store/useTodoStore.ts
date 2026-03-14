import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  createTodo,
  updateTodo,
  updateTodoStatus,
  type CreateTodoPayload,
  type TodoStatus,
  type UpdateTodoPayload,
} from "@/api/todo.api";
import type { LocalTodo } from "@/store/localTodo";
import { syncAll } from "@/store/syncService";

interface TodoState {
  todos: LocalTodo[];
  isLoading: boolean;
  error: string | null;
}

interface TodoActions {
  fetchTodos: () => Promise<void>;
  addTodo: (payload: CreateTodoPayload) => Promise<void>;
  editTodo: (id: string, payload: UpdateTodoPayload) => Promise<void>;
  removeTodo: (id: string) => void;
  toggleStatus: (id: string) => Promise<void>;
  syncWithServer: () => Promise<void>;
}

type TodoStore = TodoState & TodoActions;

const useTodoStore = create<TodoStore>()(
  persist(
    (set, get) => ({
      todos: [],
      isLoading: false,
      error: null,

      fetchTodos: async () => {
        set({ isLoading: true, error: null });
        try {
          const synced = await syncAll(get().todos);
          set({ todos: synced, isLoading: false });
        } catch (e) {
          set({ isLoading: false, error: (e as Error).message });
        }
      },

      addTodo: async (payload: CreateTodoPayload) => {
        const tempId = `local_${Date.now()}`;
        const optimistic: LocalTodo = {
          id: tempId,
          ...payload,
          syncStatus: "pending",
        };

        set((state) => ({ todos: [optimistic, ...state.todos] }));

        try {
          const serverTodo = await createTodo(payload);
          set((state) => ({
            todos: state.todos.map((t) =>
              t.id === tempId ? { ...serverTodo, syncStatus: "synced" } : t
            ),
          }));
        } catch {
          // Stays "pending" — syncWithServer will retry
        }
      },

      editTodo: async (id: string, payload: UpdateTodoPayload) => {
        set((state) => ({
          todos: state.todos.map((t) =>
            t.id === id ? { ...t, ...payload, syncStatus: "pending" } : t
          ),
        }));

        try {
          const serverTodo = await updateTodo(id, payload);
          set((state) => ({
            todos: state.todos.map((t) =>
              t.id === id ? { ...serverTodo, syncStatus: "synced" } : t
            ),
          }));
        } catch {
          // Stays "pending"
        }
      },

      removeTodo: (id: string) => {
        set((state) => ({
          todos: state.todos.map((t) =>
            t.id === id ? { ...t, syncStatus: "deleted" } : t
          ),
        }));
      },

      toggleStatus: async (id: string) => {
        const todo = get().todos.find((t) => t.id === id);
        if (!todo) return;

        const nextStatus: TodoStatus =
          todo.status === "Completed" ? "Pending" : "Completed";

        set((state) => ({
          todos: state.todos.map((t) =>
            t.id === id
              ? { ...t, status: nextStatus, syncStatus: "pending" }
              : t
          ),
        }));

        try {
          await updateTodoStatus(id, nextStatus);
          set((state) => ({
            todos: state.todos.map((t) =>
              t.id === id ? { ...t, syncStatus: "synced" } : t
            ),
          }));
        } catch {
          // Stays "pending"
        }
      },

      syncWithServer: async () => {
        set({ isLoading: true, error: null });
        try {
          const synced = await syncAll(get().todos);
          set({ todos: synced, isLoading: false });
        } catch (e) {
          set({ isLoading: false, error: (e as Error).message });
          throw e;
        }
      },
    }),
    {
      name: "meditaskpro-todos",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ todos: state.todos }),
    }
  )
);

export default useTodoStore;
