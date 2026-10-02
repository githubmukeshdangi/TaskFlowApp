import React, { useCallback, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, ScrollView, StatusBar } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import moment from "moment";
import { Ionicons } from "@expo/vector-icons";
import { useAppNavigation } from "../../hooks/useAppNavigation";
import { Task } from "../addEditTask/addEditTaskProps";
import { styles } from "./dashBoard.style";
import { getTasks } from "../../storage/taskStorage";
import { useTheme } from "../../context/ThemeContext";
const DashboardScreen = () => {
  const navigation = useAppNavigation();
  const { colors, isDark } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([]);
  const loadDashboardData = async () => {
    try {
      const storedTasks = await getTasks();
      setTasks(storedTasks);
    } catch (error) {
      console.error("Dashboard data loading error:", error);
    }
  };
  const handleAddTask = () => {
    navigation.navigate("addEditTask");
  };
  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, []),
  );
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.status === "completed").length;
  const pendingTasks = tasks.filter((task) => task.status === "pending").length;
  const todayTasks = tasks.filter((task) => task.dueDate === moment().format("YYYY-MM-DD")).length;
  const recentTasks = [...tasks].sort((a, b) => moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf()).slice(0, 3);
  const renderRecentTask = ({ item }: { item: Task }) => (
    <TouchableOpacity
      style={[styles.recentTaskCard, { backgroundColor: colors.card, borderColor: colors.border }]}
      activeOpacity={0.7}
      onPress={() => navigation.navigate("taskDetails", { taskId: item.id })}
    >
      <View style={styles.recentTaskInfo}>
        <Text style={[styles.recentTaskTitle, { color: colors.text }]} numberOfLines={2}>{item.title}</Text>
        <Text style={[styles.recentTaskDate, { color: colors.secondaryText }]}>Due: {item.dueDate}</Text>
      </View>
      <Text style={[styles.recentTaskStatus, item.status === "completed" && styles.completedStatus]}>
        {item.status.toUpperCase()}
      </Text>
    </TouchableOpacity>
  );
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.greeting, { color: colors.text }]}>Hello</Text>
        <Text style={[styles.subtitle, { color: colors.secondaryText }]}>Here's your task overview</Text>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statValue, { color: colors.primary }]}>{totalTasks}</Text>
            <Text style={[styles.statLabel, { color: colors.secondaryText }]}>Total Tasks</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statValue, { color: colors.primary }]}>{completedTasks}</Text>
            <Text style={[styles.statLabel, { color: colors.secondaryText }]}>Completed</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statValue, { color: colors.primary }]}>{pendingTasks}</Text>
            <Text style={[styles.statLabel, { color: colors.secondaryText }]}>Pending</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.statValue, { color: colors.primary }]}>{todayTasks}</Text>
            <Text style={[styles.statLabel, { color: colors.secondaryText }]}>Due Today</Text>
          </View>
        </View>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
        <TouchableOpacity
          style={[styles.uploadButton, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={() => navigation.navigate("bulkUpload")}
        >
          <View style={styles.uploadRow}>
            <Ionicons name="cloud-upload-outline" size={22} color={colors.primary} />
            <Text style={[styles.uploadButtonText, { color: colors.text }]}>Bulk Upload</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.secondaryText} />
        </TouchableOpacity>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Tasks</Text>
          <TouchableOpacity onPress={() => navigation.navigate("taskList")}>
            <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
          </TouchableOpacity>
        </View>
        {recentTasks.length > 0 ? (
          <FlatList
            data={recentTasks.slice(0, 2)}
            keyExtractor={(item) => item.id}
            renderItem={renderRecentTask}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={[styles.emptyContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No tasks yet</Text>
            <Text style={[styles.emptySubtitle, { color: colors.secondaryText }]}>Create your first task to get started.</Text>
          </View>
        )}
      </ScrollView>
      <TouchableOpacity style={styles.fab} onPress={handleAddTask}>
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};
export default DashboardScreen;