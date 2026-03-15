import { useEffect, useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import FilterTagsContainer from "@/components/header/FilterTagContainer";
import ProfileHeader from "@/components/header/ProfileHeader";
import ProgressBar from "@/components/header/ProgressBar";
import TaskModal from "@/components/tasks/TaskModal";
import TasksContainer from "@/components/tasks/TasksContainer";
import FloatingActionButton from "@/components/ui/floating-action-button";
import { useAppTheme } from "@/context/ThemeContext";
import useTodoStore from "@/store/useTodoStore";
import { LocalTodo, TodoStatus } from "@/types/Todo.type";

type StatusFilter = TodoStatus | "All";

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
  const [activeStatus, setActiveStatus] = useState<StatusFilter>("All");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTodo, setEditingTodo] = useState<LocalTodo | undefined>(
    undefined,
  );

  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const { completed, total, visible } = getTodosProgress(todos);

  const filtered =
    activeStatus === "All"
      ? visible
      : visible.filter((t) => t.status === activeStatus);

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
      <FilterTagsContainer onSelect={setActiveStatus} />
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

function createStyles(colors: ReturnType<typeof useAppTheme>["colors"]) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
  });
}
