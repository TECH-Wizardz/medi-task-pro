export type TodoPriority = "Low" | "Medium" | "High";
export type TodoStatus = "Pending" | "Completed";
export type TodoCategory = "Patients" | "Personal" | "Work";

export type Todo = {
  id: string;
  title: string;
  description: string;
  priority: TodoPriority;
  status: TodoStatus;
  completed: boolean;
  category?: TodoCategory;
  dueDate?: string;
  owner?: string;
  location?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CreateTodoPayload = {
  title: string;
  description: string;
  priority: TodoPriority;
  status: TodoStatus;
  category?: TodoCategory;
  dueDate?: string;
  owner?: string;
};

export type UpdateTodoPayload = Partial<Omit<Todo, "id">>;

export type SyncStatus = "synced" | "pending" | "deleted";

export type LocalTodo = Todo & {
  syncStatus: SyncStatus;
};
