import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/constants/theme";

import FilterTagsContainer from "@/components/header/FilterTagContainer";
import FloatingActionButton from "@/components/ui/floating-action-button";
import ProfileHeader from "@/components/header/ProfileHeader";
import ProgressBar from "@/components/header/ProgressBar";

// Static filter options — wire to store filter state when integrating
const FILTER_TAGS = ["All", "Low", "Medium", "High"];

export default function HomeScreen() {
  // TODO: replace with useTodoStore — const { todos, fetchTodos } = useTodoStore();
  // TODO: replace with useAutoSync() hook
  // TODO: replace with useState for activeFilter, modalVisible, editingTodo

  // Static progress values — derive from store: visible todos & completed count
  const completed = 3;
  const total = 8;

  return (
    <SafeAreaView style={styles.container}>
      {/* Profile avatar + greeting + sync status */}
      <ProfileHeader />

      {/* Task completion progress bar */}
      <ProgressBar completed={completed} total={total} />

      {/* Filter chips — All / Low / Medium / High */}
      {/* TODO: pass activeFilter and onSelect handler from state */}
      <FilterTagsContainer tags={FILTER_TAGS} />

      {/* TODO: wire onPress to open create-task modal */}
      <FloatingActionButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
});
