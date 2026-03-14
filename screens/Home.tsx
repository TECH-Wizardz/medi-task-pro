import { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppColors } from "@/constants/theme";

import type { TodoPriority } from "@/api/todo.api";
import FilterTagsContainer from "@/components/header/FilterTagContainer";
import FloatingActionButton from "@/components/ui/floating-action-button";
import ProfileHeader from "@/components/header/ProfileHeader";
import ProgressBar from "@/components/header/ProgressBar";
import TaskModal from "@/components/tasks/TaskModal";
import TasksContainer from "@/components/tasks/TasksContainer";
import type { LocalTodo } from "@/store/localTodo";
import useTodoStore from "@/store/useTodoStore";

const FILTER_TAGS = ["All", "Low", "Medium", "High"] as const;
type FilterTag = (typeof FILTER_TAGS)[number];

function getTodosProgress(todos: LocalTodo[]) {
  const visible = todos.filter((t) => t.syncStatus !== "deleted");
  return {
    completed: visible.filter((t) => t.status === "Completed").length,
    total: visible.length,
    visible,
  };
}

export default function HomeScreen() {
  const { todos, fetchTodos } = useTodoStore();
  const [activeFilter, setActiveFilter] = useState<FilterTag>("All");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState<LocalTodo | undefined>(
    undefined,
  );

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const { completed, total, visible } = getTodosProgress(todos);

  const filtered =
    activeFilter === "All"
      ? visible
      : visible.filter((t) => t.priority === (activeFilter as TodoPriority));

  function handleOpenCreate() {
    setEditingTodo(undefined);
    setModalVisible(true);
  }

  function handleEditRequest(id: string) {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      setEditingTodo(todo);
      setModalVisible(true);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ProfileHeader />
      <ProgressBar completed={completed} total={total} />
      <FilterTagsContainer
        tags={[...FILTER_TAGS]}
        onSelect={(tag) => setActiveFilter(tag as FilterTag)}
      />
      <TasksContainer tasks={filtered} onEditRequest={handleEditRequest} />
      <FloatingActionButton onPress={handleOpenCreate} />
      <TaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        todo={editingTodo}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white,
  },
});
