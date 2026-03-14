import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";

import FilterTag from "@/components/header/FilterTag";

type Props = {
  tags: string[];

  onSelect?: (tag: string) => void;
};

export default function FilterTagsContainer({ tags, onSelect }: Props) {
  const [active, setActive] = useState<string>(tags[0]);

  function handlePress(tag: string) {
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
      {tags.map((tag) => (
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
