import type { CreateTodoPayload, Todo, TodoStatus, UpdateTodoPayload } from "@/types/Todo.type";
import axiosInstance from "./axiosInstance";

export type {
  CreateTodoPayload, Todo, TodoCategory, TodoPriority,
  TodoStatus, UpdateTodoPayload
} from "@/types/Todo.type";

export const getTodos = async (): Promise<Todo[]> => {
  try {
    const response = await axiosInstance.get<Todo[]>("/todo");
    return response.data;
  } catch (error) {
    console.error("Error fetching todos:", error);
    throw error;
  }
};

export const getTodo = async (id: string): Promise<Todo> => {
  const response = await axiosInstance.get<Todo>(`/todo/${id}`);
  return response.data;
};

export const createTodo = async (payload: CreateTodoPayload): Promise<Todo> => {
  const response = await axiosInstance.post<Todo>("/todo", payload);
  return response.data;
};

export const updateTodo = async (id: string, payload: UpdateTodoPayload): Promise<Todo> => {
  const response = await axiosInstance.put<Todo>(`/todo/${id}`, payload);
  return response.data;
};

export const deleteTodo = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/todo/${id}`);
};

export const updateTodoStatus = async (id: string, status: TodoStatus): Promise<Todo> => {
  const response = await axiosInstance.put<Todo>(`/todo/${id}`, {
    status,
    completed: status === "Completed",
  });
  return response.data;
};
