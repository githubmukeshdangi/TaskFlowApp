import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Task } from "../addEditTask/addEditTaskProps";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { deleteTask, getTasks, saveTasks } from "../../storage/taskStorage";
import styles from "./taskListScreen.style";
import { TaskFilter } from "./taskListScreenProps";
import { useTheme } from "../../context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";

type SortOption =
  | "newest"
  | "oldest"
  | "dueDate"
  | "priorityHigh"
  | "priorityLow";

const sortOptions: { label: string; value: SortOption }[] = [
  { label: "Newest First", value: "newest" },
  { label: "Oldest First", value: "oldest" },
  { label: "Due Date: Earliest", value: "dueDate" },
  { label: "Priority: High to Low", value: "priorityHigh" },
  { label: "Priority: Low to High", value: "priorityLow" },
];

const TaskListScreen = () => {
  const navigation = useAppNavigation();
  const { colors, isDark } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchText, setSearchText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<TaskFilter>("all");
  const [selectedSort, setSelectedSort] = useState<SortOption>("newest");
  const [showSortOptions, setShowSortOptions] = useState(false);

  const loadTasks = async () => {
    const storedTasks = await getTasks();
    setTasks(storedTasks);
  };

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, []),
  );

  const handleToggleStatus = async (task: Task) => {
    const updatedTask: Task = {
      ...task,
      status: task.status === "completed" ? "pending" : "completed",
      updatedAt: new Date().toISOString(),
    };
    const updatedTasks = tasks.map((item) =>
      item.id === task.id ? updatedTask : item,
    );
    setTasks(updatedTasks);
    await saveTasks(updatedTasks);
  };

  const handleDeleteTask = (taskId: string) => {
    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteTask(taskId);
          await loadTasks();
        },
      },
    ]);
  };
    const handleAddTask = () => {
    navigation.navigate("addEditTask");
  };

  const getDateValue = (date: string) => {
    const parsedDate = new Date(`${date}T00:00:00`);
    return Number.isNaN(parsedDate.getTime()) ? 0 : parsedDate.getTime();
  };

  const getPriorityValue = (priority: string) => {
    const values: Record<string, number> = {
      high: 3,
      medium: 2,
      low: 1,
    };
    return values[priority.toLowerCase()] ?? 0;
  };

  const filteredTasks = tasks
    .filter((task) => {
      const matchesSearch = task.title
        .toLowerCase()
        .includes(searchText.toLowerCase());
      const matchesFilter =
        selectedFilter === "all" || task.status === selectedFilter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (selectedSort) {
        case "newest":
          return getDateValue(b.createdAt) - getDateValue(a.createdAt);
        case "oldest":
          return getDateValue(a.createdAt) - getDateValue(b.createdAt);
        case "dueDate":
          return getDateValue(a.dueDate) - getDateValue(b.dueDate);
        case "priorityHigh":
          return getPriorityValue(b.priority) - getPriorityValue(a.priority);
        case "priorityLow":
          return getPriorityValue(a.priority) - getPriorityValue(b.priority);
        default:
          return 0;
      }
    });

  const getTaskDateStatus = (task: Task) => {
    if (task.status === "completed") {
      return {
        label: "COMPLETED",
        color: isDark ? "#4ADE80" : "#15803D",
        backgroundColor: isDark ? "#14532D" : "#DCFCE7",
      };
    }

    const dueDate = new Date(task.dueDate);
    const today = new Date();

    dueDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (Number.isNaN(dueDate.getTime())) {
      return {
        label: task.status.toUpperCase(),
        color: colors.secondaryText,
        backgroundColor: colors.background,
      };
    }

    if (dueDate.getTime() < today.getTime()) {
      return {
        label: "OVERDUE",
        color: isDark ? "#FCA5A5" : "#B91C1C",
        backgroundColor: isDark ? "#7F1D1D" : "#FEE2E2",
      };
    }

    if (dueDate.getTime() === today.getTime()) {
      return {
        label: "DUE TODAY",
        color: isDark ? "#FCD34D" : "#B45309",
        backgroundColor: isDark ? "#78350F" : "#FEF3C7",
      };
    }

    return {
      label: task.status.toUpperCase(),
      color: colors.secondaryText,
      backgroundColor: colors.background,
    };
  };
  const renderTask = ({ item }: { item: Task }) => {
    const dateStatus = getTaskDateStatus(item);

    return (
      <TouchableOpacity
        style={[
          styles.taskCard,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
        onPress={() => navigation.navigate("taskDetails", { taskId: item.id })}
      >
        <View style={styles.taskHeader}>
          <Text style={[styles.taskTitle, { color: colors.text }]}>
            {item.title}
          </Text>
          <Text style={[styles.taskPriority, { color: colors.text }]}>
            {item.priority.toUpperCase()}
          </Text>
        </View>
        <Text style={[styles.taskCategory, { color: colors.secondaryText }]}>
          {item.category}
        </Text>
        <Text style={[styles.taskDueDate, { color: colors.secondaryText }]}>
          Due: {item.dueDate}
        </Text>
        <View
          style={{
            alignSelf: "flex-start",
            backgroundColor: dateStatus.backgroundColor,
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 8,
            marginTop: 8,
          }}
        >
          <Text
            style={{ color: dateStatus.color, fontSize: 12, fontWeight: "700" }}
          >
            {dateStatus.label}
          </Text>
        </View>
        <View style={styles.actionRow}>
          <TouchableOpacity
            onPress={() => handleToggleStatus(item)}
            hitSlop={10}
          >
            <Text style={[styles.actionText, { color: colors.primary }]}>
              {item.status === "completed" ? "Mark Pending" : "Complete"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("addEditTask", { taskId: item.id })
            }
            hitSlop={10}
          >
            <Text style={[styles.actionText, { color: colors.primary }]}>
              Edit
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDeleteTask(item.id)}
            hitSlop={10}
          >
            <Text style={[styles.deleteText, { color: colors.danger }]}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  // const renderTask = ({ item }: { item: Task }) => (
  //   <TouchableOpacity
  //     style={[styles.taskCard, { backgroundColor: colors.card, borderColor: colors.border }]}
  //     onPress={() => navigation.navigate('taskDetails', { taskId: item.id })}
  //   >
  //     <View style={styles.taskHeader}>
  //       <Text style={[styles.taskTitle, { color: colors.text }]}>{item.title}</Text>
  //       <Text style={[styles.taskPriority, { color: colors.text }]}>{item.priority.toUpperCase()}</Text>
  //     </View>
  //     <Text style={[styles.taskCategory, { color: colors.secondaryText }]}>{item.category}</Text>
  //     <Text style={[styles.taskDueDate, { color: colors.secondaryText }]}>Due: {item.dueDate}</Text>
  //     <Text style={[styles.taskStatus, { color: item.status === 'completed' ? '#16A34A' : '#D97706' }]}>
  //       {item.status.toUpperCase()}
  //     </Text>
  //     <View style={styles.actionRow}>
  //       <TouchableOpacity onPress={() => handleToggleStatus(item)} hitSlop={10}>
  //         <Text style={[styles.actionText, { color: colors.primary }]}>
  //           {item.status === 'completed' ? 'Mark Pending' : 'Complete'}
  //         </Text>
  //       </TouchableOpacity>
  //       <TouchableOpacity onPress={() => navigation.navigate('addEditTask', { taskId: item.id })} hitSlop={10}>
  //         <Text style={[styles.actionText, { color: colors.primary }]}>Edit</Text>
  //       </TouchableOpacity>
  //       <TouchableOpacity onPress={() => handleDeleteTask(item.id)} hitSlop={10}>
  //         <Text style={[styles.deleteText, { color: colors.danger }]}>Delete</Text>
  //       </TouchableOpacity>
  //     </View>
  //   </TouchableOpacity>
  // );

  const currentSortLabel = sortOptions.find(
    (option) => option.value === selectedSort,
  )?.label;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TextInput
        style={[
          styles.searchInput,
          {
            backgroundColor: colors.card,
            color: colors.text,
            borderColor: colors.border,
          },
        ]}
        placeholder="Search tasks..."
        placeholderTextColor={colors.secondaryText}
        value={searchText}
        onChangeText={setSearchText}
      />
      <View style={styles.filterRow}>
        {(["all", "pending", "completed"] as TaskFilter[]).map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              { backgroundColor: colors.card, borderColor: colors.border },
              selectedFilter === filter && {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              },
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                { color: colors.secondaryText },
                selectedFilter === filter && { color: "#FFFFFF" },
              ]}
            >
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={[
          styles.sortButton,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
        onPress={() => setShowSortOptions((prev) => !prev)}
      >
          <View style={styles.sortOptionContent}>
    <Text style={[styles.sortButtonText, { color: colors.text }]}>
      Sort By: {currentSortLabel}
    </Text>
    <Ionicons
      name={showSortOptions ? 'chevron-up' : 'chevron-down'}
      size={20}
      color={colors.secondaryText}
    />
  </View>
      </TouchableOpacity>
      {showSortOptions && (
        <View
          style={[
            styles.sortOptionsContainer,
            { backgroundColor: colors.card, borderColor: colors.border },
          ]}
        >
          {sortOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.sortOption,
                selectedSort === option.value && {
                  backgroundColor: isDark ? "#334155" : "#DBEAFE",
                },
              ]}
              onPress={() => {
                setSelectedSort(option.value);
                setShowSortOptions(false);
              }}
            >
              <View style={styles.sortOptionContent}>
                <Text
                  style={[
                    styles.sortOptionText,
                    {
                      color:
                        selectedSort === option.value
                          ? colors.primary
                          : colors.text,
                    },
                  ]}
                >
                  {option.label}
                </Text>
                {selectedSort === option.value && (
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={colors.primary}
                  />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: colors.secondaryText }]}>
            No tasks found.
          </Text>
        }
      />
    <TouchableOpacity style={styles.fab} onPress={handleAddTask}>
           <Ionicons name="add" size={30} color="#FFFFFF" />
         </TouchableOpacity>
    </View>
  );
};

export default TaskListScreen;
