import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type {
  CreateTodoPayload,
  TodoStatus,
  UpdateTodoPayload,
} from "@/api/todo.api";
import { syncAll } from "@/store/syncService";
import { LocalTodo } from "@/types/Todo.type";

interface TodoState {
  todos: LocalTodo[];
  isLoading: boolean;
  error: string | null;
}

interface TodoActions {
  fetchTodos: () => Promise<void>;
  addTodo: (payload: CreateTodoPayload) => void;
  editTodo: (id: string, payload: UpdateTodoPayload) => void;
  removeTodo: (id: string) => void;
  toggleStatus: (id: string) => void;
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
          set({ isLoading: false, error: e instanceof Error ? e.message : "Fetch failed" });
        }
      },

      addTodo: (payload: CreateTodoPayload) => {
        const optimistic: LocalTodo = {
          id: `local_${Date.now()}`,
          ...payload,
          syncStatus: "pending",
          completed: payload.status === "Completed",
        };
        set((state) => ({ todos: [optimistic, ...state.todos] }));
      },

      editTodo: (id: string, payload: UpdateTodoPayload) => {
        set((state) => ({
          todos: state.todos.map((t) =>
            t.id === id ? { ...t, ...payload, syncStatus: "pending" as const } : t
          ),
        }));
      },

      removeTodo: (id: string) => {
        set((state) => ({
          todos: state.todos.map((t) =>
            t.id === id ? { ...t, syncStatus: "deleted" as const } : t
          ),
        }));
      },

      toggleStatus: (id: string) => {
        const todo = get().todos.find((t) => t.id === id);
        if (!todo) return;

        const nextStatus: TodoStatus =
          todo.status === "Completed" ? "Pending" : "Completed";

        set((state) => ({
          todos: state.todos.map((t) =>
            t.id === id
              ? { ...t, status: nextStatus, completed: nextStatus === "Completed", syncStatus: "pending" as const }
              : t
          ),
        }));
      },

      syncWithServer: async () => {
        set({ isLoading: true, error: null });
        try {
          const synced = await syncAll(get().todos);
          set({ todos: synced, isLoading: false });
        } catch (e) {
          set({
            isLoading: false,
            error: e instanceof Error ? e.message : "Sync failed",
          });
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
