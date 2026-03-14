import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import ConfirmationModal from "@/components/ConfirmationModal";
import TaskCard from "@/components/tasks/TaskCard";
import type { LocalTodo } from "@/store/localTodo";
import useTodoStore from "@/store/useTodoStore";

type CardPriority = "LOW" | "MEDIUM" | "HIGH";

function toCardPriority(p: string): CardPriority {
  const map: Record<string, CardPriority> = {
    low: "LOW",
    medium: "MEDIUM",
    high: "HIGH",
  };
  return map[p?.toLowerCase()] ?? "LOW";
}

type Props = {
  tasks: LocalTodo[];
  onEditRequest: (id: string) => void;
};

export default function TasksContainer({ tasks, onEditRequest }: Props) {
  const toggleStatus = useTodoStore((s) => s.toggleStatus);
  const removeTodo = useTodoStore((s) => s.removeTodo);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const PRIORITY_RANK: Record<string, number> = { High: 0, Medium: 1, Low: 2 };

  function handleDeleteRequest(id: string) {
    setDeleteTargetId(id);
  }
  function handleDeleteConfirm() {
    if (deleteTargetId) removeTodo(deleteTargetId);
    setDeleteTargetId(null);
  }
  function handleEditRequest(id: string) {
    onEditRequest(id);
  }

  const visible = tasks
    .filter((t) => t.syncStatus !== "deleted")
    .sort((a, b) => {
      const aCompleted = a.status === "Completed" ? 1 : 0;
      const bCompleted = b.status === "Completed" ? 1 : 0;
      if (aCompleted !== bCompleted) return aCompleted - bCompleted;
      return (
        (PRIORITY_RANK[a.priority] ?? 2) - (PRIORITY_RANK[b.priority] ?? 2)
      );
    });

  return (
    <View style={styles.wrapper}>
      <FlatList
        data={visible}
        keyExtractor={(item) => item.id}
        style={styles.container}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TaskCard
            id={item.id}
            title={item.title}
            description={item.description}
            completed={item.status === "Completed"}
            priority={toCardPriority(item.priority)}
            category={item.category}
            dueDate={item.dueDate}
            owner={item.owner}
            onToggle={toggleStatus}
            onDelete={handleDeleteRequest}
            onEdit={handleEditRequest}
          />
        )}
      />
      <ConfirmationModal
        visible={deleteTargetId !== null}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  list: {
    paddingVertical: 8,
  },
});
