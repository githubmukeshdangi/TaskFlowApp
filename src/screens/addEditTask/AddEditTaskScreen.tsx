import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./addEditTaskScreen.style";
import { useAppNavigation, useAppRoute } from "../../hooks/useAppNavigation";
import { Task, TaskPriority, TaskStatus } from "./addEditTaskProps";
import { categories, priorities, statuses } from "./addEditTask.const";
import { behavior } from "../../utils/common";
import { useTheme } from "../../context/ThemeContext";
import moment from "moment";
import { addTask, getTasks, updateTask } from "../../storage/taskStorage";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

const AddEditTaskScreen = () => {
  const navigation = useAppNavigation();
  const route = useAppRoute<"addEditTask">();
  const taskId = route.params?.taskId;
  const { colors, isDark } = useTheme();
  const isEditMode = Boolean(taskId);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Work");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<TaskStatus>("pending");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showDuePicker, setShowDuePicker] = useState(false);

  useEffect(() => {
    const loadTask = async () => {
      if (!taskId) return;
      try {
        const tasks = await getTasks();
        const task = tasks.find((item: Task) => item.id === taskId);
        if (!task) {
          Alert.alert("Error", "Task not found");
          return;
        }
        setTitle(task.title);
        setDescription(task.description);
        setCategory(task.category);
        setPriority(task.priority);
        setStartDate(task.startDate);
        setDueDate(task.dueDate);
        setStatus(task.status);
      } catch (error) {
        console.error("Error loading task:", error);
        Alert.alert("Error", "Unable to load task");
      }
    };
    loadTask();
  }, [taskId]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) {
      newErrors.title = "Task title is required";
    }
    if (!category) {
      newErrors.category = "Please select a category";
    }
    const isValidDate = (value: string): boolean => {
      return moment(value, "YYYY-MM-DD", true).isValid();
    };
    if (!startDate.trim()) {
      newErrors.startDate = "Start date is required";
    } else if (!isValidDate(startDate)) {
      newErrors.startDate = "Use a valid date in YYYY-MM-DD format";
    }
    if (!dueDate.trim()) {
      newErrors.dueDate = "Due date is required";
    } else if (!isValidDate(dueDate)) {
      newErrors.dueDate = "Use a valid date in YYYY-MM-DD format";
    }
    if (
      isValidDate(startDate) &&
      isValidDate(dueDate) &&
      moment(dueDate, "YYYY-MM-DD", true).isBefore(
        moment(startDate, "YYYY-MM-DD", true),
        "day",
      )
    ) {
      newErrors.dueDate = "Due date cannot be earlier than start date";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      const now = new Date().toISOString();
      const tasks = await getTasks();
      if (isEditMode) {
        const existingTask = tasks.find((task: Task) => task.id === taskId);
        if (!existingTask) {
          Alert.alert("Error", "Task not found");
          return;
        }
        const updatedTask: Task = {
          ...existingTask,
          title: title.trim(),
          description: description.trim(),
          category,
          priority,
          startDate,
          dueDate,
          status,
          updatedAt: now,
        };
        await updateTask(updatedTask);
        Alert.alert("Success", "Task updated successfully");
      } else {
        const newTask: Task = {
          id: Date.now().toString(),
          title: title.trim(),
          description: description.trim(),
          category,
          priority,
          startDate,
          dueDate,
          status,
          createdAt: now,
          updatedAt: now,
        };
        await addTask(newTask);
        Alert.alert("Success", "Task added successfully");
      }
      navigation.goBack();
    } catch (error) {
      console.error("Error saving task:", error);
      Alert.alert("Error", "Unable to save task. Please try again.");
    }
  };

  const getPickerDate = (value: string) => {
    return moment(value, "YYYY-MM-DD", true).isValid()
      ? moment(value, "YYYY-MM-DD").toDate()
      : new Date();
  };
  const handleStartDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    setShowStartPicker(false);
    if (event.type === "set" && selectedDate) {
      const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
      setStartDate(formattedDate);
      setErrors((prev) => ({
        ...prev,
        startDate: "",
        dueDate:
          dueDate &&
          moment(dueDate, "YYYY-MM-DD", true).isValid() &&
          moment(dueDate, "YYYY-MM-DD", true).isBefore(
            moment(formattedDate, "YYYY-MM-DD", true),
            "day",
          )
            ? "Due date cannot be earlier than start date"
            : "",
      }));
    }
  };
  const handleDueDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    setShowDuePicker(false);
    if (event.type === "set" && selectedDate) {
      const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
      setDueDate(formattedDate);
      setErrors((prev) => ({
        ...prev,
        dueDate: moment(formattedDate, "YYYY-MM-DD", true).isBefore(
          moment(startDate, "YYYY-MM-DD", true),
          "day",
        )
          ? "Due date cannot be earlier than start date"
          : "",
      }));
    }
  };

  const renderError = (field: string) => {
    if (!errors[field]) return null;
    return <Text style={styles.errorText}>{errors[field]}</Text>;
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={behavior}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={[styles.heading, { color: colors.text }]}>
            {isEditMode ? "Edit Task" : "Add New Task"}
          </Text>
          <Text style={[styles.subHeading, { color: colors.secondaryText }]}>
            Fill in the details below to organize your task.
          </Text>
        </View>
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>
            Task Title <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.card,
                color: colors.text,
                borderColor: errors.title ? colors.danger : colors.border,
              },
              errors.title ? styles.inputError : null,
            ]}
            placeholder="Enter task title"
            placeholderTextColor={colors.secondaryText}
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
          {renderError("title")}
        </View>
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>
            Description
          </Text>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              {
                backgroundColor: colors.card,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            placeholder="Describe your task..."
            placeholderTextColor={colors.secondaryText}
            value={description}
            onChangeText={setDescription}
            multiline
            textAlignVertical="top"
            maxLength={1000}
          />
        </View>
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>
            Category <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.optionContainer}>
            {categories.map((item) => {
              const isSelected = category === item;
              return (
                <Pressable
                  key={item}
                  onPress={() => setCategory(item)}
                  style={[
                    styles.optionButton,
                    {
                      backgroundColor: isSelected
                        ? colors.primary
                        : colors.card,
                      borderColor: isSelected ? colors.primary : colors.border,
                    },
                    isSelected && styles.selectedOption,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: isSelected ? "#FFFFFF" : colors.text },
                      isSelected && styles.selectedOptionText,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {renderError("category")}
        </View>
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Priority</Text>
          <View style={styles.optionContainer}>
            {priorities.map((item) => {
              const isSelected = priority === item;
              return (
                <Pressable
                  key={item}
                  onPress={() => setPriority(item)}
                  style={[
                    styles.optionButton,
                    {
                      backgroundColor: isSelected
                        ? colors.primary
                        : colors.card,
                      borderColor: isSelected ? colors.primary : colors.border,
                    },
                    isSelected && styles.selectedOption,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: isSelected ? "#FFFFFF" : colors.text },
                      isSelected && styles.selectedOptionText,
                    ]}
                  >
                    {item.charAt(0).toUpperCase() + item.slice(1)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>
            Start Date <Text style={styles.required}>*</Text>
          </Text>
          <Pressable
            style={[
              styles.dateInputContainer,
              {
                backgroundColor: colors.card,
                borderColor: errors.startDate ? colors.danger : colors.border,
              },
              errors.startDate ? styles.inputError : null,
            ]}
            onPress={() => setShowStartPicker(true)}
          >
            <Text
              style={[
                styles.dateInput,
                { color: startDate ? colors.text : colors.secondaryText },
              ]}
            >
              {startDate || "YYYY-MM-DD"}
            </Text>
            <Ionicons
              name="calendar-outline"
              size={20}
              color={colors.secondaryText}
            />
          </Pressable>
          {renderError("startDate")}
        </View>
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>
            Due Date <Text style={styles.required}>*</Text>
          </Text>
          <Pressable
            style={[
              styles.dateInputContainer,
              {
                backgroundColor: colors.card,
                borderColor: errors.dueDate ? colors.danger : colors.border,
              },
              errors.dueDate ? styles.inputError : null,
            ]}
            onPress={() => setShowDuePicker(true)}
          >
            <Text
              style={[
                styles.dateInput,
                { color: dueDate ? colors.text : colors.secondaryText },
              ]}
            >
              {dueDate || "YYYY-MM-DD"}
            </Text>
            <Ionicons
              name="calendar-outline"
              size={20}
              color={colors.secondaryText}
            />
          </Pressable>
          {renderError("dueDate")}
        </View>
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: colors.text }]}>Status</Text>
          <View style={styles.optionContainer}>
            {statuses.map((item) => {
              const isSelected = status === item;
              return (
                <Pressable
                  key={item}
                  onPress={() => setStatus(item)}
                  style={[
                    styles.optionButton,
                    {
                      backgroundColor: isSelected
                        ? colors.primary
                        : colors.card,
                      borderColor: isSelected ? colors.primary : colors.border,
                    },
                    isSelected && styles.selectedOption,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      { color: isSelected ? "#FFFFFF" : colors.text },
                      isSelected && styles.selectedOptionText,
                    ]}
                  >
                    {item === "pending" ? "Pending" : "Completed"}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Pressable
            style={[
              styles.cancelButton,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.cancelButtonText, { color: colors.text }]}>
              Cancel
            </Text>
          </Pressable>
          <Pressable
            style={[styles.saveButton, { backgroundColor: colors.primary }]}
            onPress={handleSave}
          >
            <Ionicons name="checkmark" size={19} color="#FFFFFF" />
            <Text style={styles.saveButtonText}>
              {isEditMode ? "Update Task" : "Save Task"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
      {showStartPicker && (
        <DateTimePicker
          value={getPickerDate(startDate)}
          mode="date"
          display="default"
          maximumDate={
            dueDate && moment(dueDate, "YYYY-MM-DD", true).isValid()
              ? getPickerDate(dueDate)
              : undefined
          }
          onChange={handleStartDateChange}
          themeVariant={isDark ? "dark" : "light"}
        />
      )}
      {showDuePicker && (
        <DateTimePicker
          value={getPickerDate(dueDate || startDate)}
          mode="date"
          display="default"
          minimumDate={
            startDate && moment(startDate, "YYYY-MM-DD", true).isValid()
              ? getPickerDate(startDate)
              : undefined
          }
          onChange={handleDueDateChange}
          themeVariant={isDark ? "dark" : "light"}
        />
      )}
    </KeyboardAvoidingView>
  );
};

export default AddEditTaskScreen;
