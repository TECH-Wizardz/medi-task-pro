import Ionicons from "@expo/vector-icons/Ionicons";
import { yupResolver } from "@hookform/resolvers/yup";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as Yup from "yup";

import type {
  CreateTodoPayload,
  TodoCategory,
  TodoPriority,
  UpdateTodoPayload,
} from "@/api/todo.api";

import { AppColors } from "@/constants/theme";
import useTodoStore from "@/store/useTodoStore";
import { LocalTodo } from "@/types/Todo.type";

type FormValues = {
  title: string;
  description: string;
  priority: TodoPriority;
  category: TodoCategory;
  dueDate: string;
  owner: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  /** Pass an existing todo to switch to edit mode. Omit for create mode. */
  todo?: LocalTodo;
};

const schema = Yup.object({
  title: Yup.string().trim().required("Title is required"),
  description: Yup.string().trim().required("Description is required"),
  priority: Yup.mixed<TodoPriority>()
    .oneOf(["Low", "Medium", "High"])
    .required(),
  category: Yup.mixed<TodoCategory>()
    .oneOf(["Patients", "Personal", "Work"])
    .required("Category is required"),
  dueDate: Yup.string().optional().default(""),
  owner: Yup.string().optional().default(""),
});

const PRIORITIES: TodoPriority[] = ["High", "Medium", "Low"];
const CATEGORIES: TodoCategory[] = ["Personal", "Work", "Patients"];

const PRIORITY_COLOR: Record<TodoPriority, string> = {
  High: AppColors.error,
  Medium: AppColors.warning,
  Low: AppColors.success,
};

const CATEGORY_COLOR: Record<TodoCategory, string> = {
  Personal: AppColors.primary,
  Work: AppColors.orange,
  Patients: AppColors.purple,
};

function formatDateLabel(isoDate: string): string {
  if (!isoDate) return "";
  const d = new Date(isoDate + "T00:00:00");
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function TaskModal({ visible, onClose, todo }: Props) {
  const addTodo = useTodoStore((s) => s.addTodo);
  const editTodo = useTodoStore((s) => s.editTodo);
  const isEdit = !!todo;

  const [showDatePicker, setShowDatePicker] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      priority: "Low",
      category: "Personal",
      dueDate: "",
      owner: "",
    },
  });

  useEffect(() => {
    if (visible) {
      setShowDatePicker(false);
      reset({
        title: todo?.title ?? "",
        description: todo?.description ?? "",
        priority: todo?.priority ?? "Low",
        category: (todo?.category as TodoCategory) ?? "Personal",
        dueDate: todo?.dueDate ?? "",
        owner: todo?.owner ?? "",
      });
    }
    // reset is stable; we intentionally key on todo.id + visible to avoid
    // resetting mid-edit when the store updates the todo reference
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, todo?.id, reset]);

  async function onSubmit(values: FormValues) {
    const payload: CreateTodoPayload | UpdateTodoPayload = {
      title: values.title,
      description: values.description,
      priority: values.priority,
      category: values.category,
      status: todo?.status ?? "Pending",
      dueDate: values.dueDate || undefined,
      owner: values.owner || undefined,
    };

    if (isEdit && todo) {
      await editTodo(todo.id, payload as UpdateTodoPayload);
    } else {
      await addTodo(payload as CreateTodoPayload);
    }

    reset();
    onClose();
  }

  function handleClose() {
    setShowDatePicker(false);
    reset();
    onClose();
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Pressable style={styles.backdrop} onPress={handleClose} />

        <View style={styles.sheet}>
          {/* Handle bar */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {isEdit ? "Edit Task" : "Add New Task"}
            </Text>
            <Pressable onPress={handleClose} hitSlop={8}>
              <Ionicons name="close" size={22} color={AppColors.gray500} />
            </Pressable>
          </View>

          <ScrollView
            contentContainerStyle={styles.body}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Title */}
            <Field label="Title" error={errors.title?.message}>
              <Controller
                control={control}
                name="title"
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextInput
                    style={[styles.input, errors.title && styles.inputError]}
                    placeholder="e.g., Surgery consultation"
                    placeholderTextColor={AppColors.gray400}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    returnKeyType="next"
                  />
                )}
              />
            </Field>

            {/* Description */}
            <Field label="Description" error={errors.description?.message}>
              <Controller
                control={control}
                name="description"
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextInput
                    style={[
                      styles.input,
                      styles.textArea,
                      errors.description && styles.inputError,
                    ]}
                    placeholder="Add details about the task..."
                    placeholderTextColor={AppColors.gray400}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                )}
              />
            </Field>

            {/* Priority */}
            <Field label="Priority" error={errors.priority?.message}>
              <Controller
                control={control}
                name="priority"
                render={({ field: { value, onChange } }) => (
                  <View style={styles.chipRow}>
                    {PRIORITIES.map((p) => {
                      const selected = value === p;
                      const color = PRIORITY_COLOR[p];
                      return (
                        <Pressable
                          key={p}
                          onPress={() => onChange(p)}
                          style={[
                            styles.chip,
                            {
                              backgroundColor: selected
                                ? `${color}20`
                                : AppColors.gray50,
                              borderColor: selected ? color : AppColors.gray200,
                            },
                          ]}
                        >
                          <View
                            style={[styles.dot, { backgroundColor: color }]}
                          />
                          <Text
                            style={[
                              styles.chipText,
                              { color: selected ? color : AppColors.gray500 },
                            ]}
                          >
                            {p}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                )}
              />
            </Field>

            {/* Category */}
            <Field label="Category" error={errors.category?.message}>
              <Controller
                control={control}
                name="category"
                render={({ field: { value, onChange } }) => (
                  <View style={styles.chipRow}>
                    {CATEGORIES.map((c) => {
                      const selected = value === c;
                      const color = CATEGORY_COLOR[c];
                      return (
                        <Pressable
                          key={c}
                          onPress={() => onChange(c)}
                          style={[
                            styles.chip,
                            {
                              backgroundColor: selected
                                ? `${color}18`
                                : AppColors.gray50,
                              borderColor: selected ? color : AppColors.gray200,
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.chipText,
                              { color: selected ? color : AppColors.gray500 },
                            ]}
                          >
                            {c}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                )}
              />
            </Field>

            {/* Due Date */}
            <Field label="Due Date (optional)" error={errors.dueDate?.message}>
              <Controller
                control={control}
                name="dueDate"
                render={({ field: { value, onChange } }) => (
                  <View>
                    <Pressable
                      style={styles.dateBtn}
                      onPress={() => setShowDatePicker((prev) => !prev)}
                    >
                      <Ionicons
                        name="calendar-outline"
                        size={16}
                        color={AppColors.gray500}
                      />
                      <Text
                        style={[
                          styles.dateBtnText,
                          !value && styles.datePlaceholder,
                        ]}
                      >
                        {value ? formatDateLabel(value) : "Select a date"}
                      </Text>
                      {value ? (
                        <Pressable
                          onPress={() => {
                            onChange("");
                            setShowDatePicker(false);
                          }}
                          hitSlop={8}
                          style={styles.dateClear}
                        >
                          <Ionicons
                            name="close-circle"
                            size={16}
                            color={AppColors.gray400}
                          />
                        </Pressable>
                      ) : null}
                    </Pressable>

                    {showDatePicker && (
                      <View style={styles.datePickerWrapper}>
                        <DateTimePicker
                          value={
                            value ? new Date(value + "T00:00:00") : new Date()
                          }
                          mode="date"
                          display={
                            Platform.OS === "ios" ? "spinner" : "default"
                          }
                          minimumDate={new Date()}
                          onChange={(event, selected) => {
                            if (Platform.OS === "android") {
                              setShowDatePicker(false);
                            }
                            if (event.type === "set" && selected) {
                              const iso = selected.toISOString().split("T")[0];
                              onChange(iso);
                            }
                          }}
                        />
                        {Platform.OS === "ios" && (
                          <Pressable
                            style={styles.dateConfirmBtn}
                            onPress={() => setShowDatePicker(false)}
                          >
                            <Text style={styles.dateConfirmText}>Done</Text>
                          </Pressable>
                        )}
                      </View>
                    )}
                  </View>
                )}
              />
            </Field>

            {/* Owner */}
            <Field label="Owner (optional)" error={errors.owner?.message}>
              <Controller
                control={control}
                name="owner"
                render={({ field: { value, onChange, onBlur } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. Dr. Smith"
                    placeholderTextColor={AppColors.gray400}
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    returnKeyType="done"
                  />
                )}
              />
            </Field>
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <Pressable style={styles.cancelBtn} onPress={handleClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[
                styles.submitBtn,
                isSubmitting && styles.submitBtnDisabled,
              ]}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
            >
              <Ionicons
                name={
                  isEdit ? "checkmark-circle-outline" : "add-circle-outline"
                }
                size={18}
                color={AppColors.white}
                style={styles.submitIcon}
              />
              <Text style={styles.submitText}>
                {isEdit ? "Save Changes" : "Add Task"}
              </Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: AppColors.overlay,
  },
  sheet: {
    backgroundColor: AppColors.cardBg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: AppColors.gray200,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.slate100,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: AppColors.gray900,
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
    gap: 20,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: AppColors.gray700,
  },
  input: {
    borderWidth: 1,
    borderColor: AppColors.gray200,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: AppColors.gray900,
    backgroundColor: AppColors.offWhite,
  },
  textArea: {
    minHeight: 100,
  },
  inputError: {
    borderColor: AppColors.error,
  },
  errorText: {
    fontSize: 12,
    color: AppColors.error,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
  },
  dateBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: AppColors.gray200,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: AppColors.offWhite,
  },
  dateBtnText: {
    flex: 1,
    fontSize: 15,
    color: AppColors.gray900,
  },
  datePlaceholder: {
    color: AppColors.gray400,
  },
  dateClear: {
    padding: 2,
  },
  datePickerWrapper: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: AppColors.gray200,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: AppColors.offWhite,
  },
  dateConfirmBtn: {
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: AppColors.gray200,
  },
  dateConfirmText: {
    fontSize: 15,
    fontWeight: "600",
    color: AppColors.primaryDark,
  },
  footer: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: AppColors.slate100,
  },
  cancelBtn: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: AppColors.gray100,
  },
  cancelText: {
    fontSize: 15,
    fontWeight: "600",
    color: AppColors.gray700,
  },
  submitBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AppColors.primaryDark,
    borderRadius: 12,
    paddingVertical: 14,
    gap: 6,
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitIcon: {
    marginRight: 2,
  },
  submitText: {
    fontSize: 15,
    fontWeight: "700",
    color: AppColors.white,
  },
});
