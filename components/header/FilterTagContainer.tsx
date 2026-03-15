import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";

import FilterTag from "@/components/header/FilterTag";
import { TodoStatus } from "@/types/Todo.type";

type StatusFilter = TodoStatus | "All";

const TAGS: StatusFilter[] = ["All", "Pending", "Completed"];

type Props = {
  onSelect?: (filter: StatusFilter) => void;
};

export default function FilterTagsContainer({ onSelect }: Props) {
  const [active, setActive] = useState<StatusFilter>("All");

  function handlePress(tag: StatusFilter) {
    setActive(tag);
    onSelect?.(tag);
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
      style={styles.container}
    >
      {TAGS.map((tag) => (
        <FilterTag
          key={tag}
          label={tag}
          active={active === tag}
          onPress={() => handlePress(tag)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 0,
    flexShrink: 0,
    height: 54,
    marginBottom: 8,
  },
  content: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
});
