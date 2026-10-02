import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, ActivityIndicator, StatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import styles from './taskDetailsScreen.style';
import { useAppNavigation, useAppRoute } from '../../hooks/useAppNavigation';
import { deleteTask, getTasks, updateTask } from '../../storage/taskStorage';
import { Task } from '../addEditTask/addEditTaskProps';
import { useTheme } from '../../context/ThemeContext';

const TaskDetailsScreen = () => {
  const navigation = useAppNavigation();
  const route = useAppRoute<'taskDetails'>();
  const { taskId } = route.params;
  const { colors, isDark } = useTheme();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const loadTask = async () => {
    setLoading(true);
    const storedTasks = await getTasks();
    const selectedTask = storedTasks.find((item: Task) => item.id === taskId);
    setTask(selectedTask ?? null);
    setLoading(false);
  };
  useFocusEffect(
    useCallback(() => {
      loadTask();
    }, [taskId]),
  );
  const handleEdit = () => {
    navigation.navigate('addEditTask', { taskId });
  };
  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteTask(taskId);
            Alert.alert('Success', 'Task deleted successfully');
            navigation.goBack();
          },
        },
      ],
    );
  };
  const handleMarkCompleted = async () => {
    if (!task) return;
    const updatedTask: Task = {
      ...task,
      status: 'completed',
      updatedAt: new Date().toISOString(),
    };
    await updateTask(updatedTask);
    setTask(updatedTask);
    Alert.alert('Success', 'Task marked as completed');
  };
  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  if (!task) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
        <Ionicons name="alert-circle-outline" size={45} color={colors.secondaryText} />
        <Text style={[styles.notFoundText, { color: colors.text }]}>Task not found</Text>
        <TouchableOpacity style={[styles.backButton, { backgroundColor: colors.primary }]} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.content}
    >
      <View style={[styles.detailsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.statusBadge, task.status === 'completed' && styles.completedBadge]}>
          <Text style={[styles.statusText, task.status === 'completed' && styles.completedText]}>
            {task.status.toUpperCase()}
          </Text>
        </View>
        <Text style={[styles.label, { color: colors.secondaryText }]}>Task Title</Text>
        <Text style={[styles.title, { color: colors.text }]}>{task.title}</Text>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <Text style={[styles.label, { color: colors.secondaryText }]}>Description</Text>
        <Text style={[styles.description, { color: colors.text }]}>
          {task.description || 'No description provided'}
        </Text>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <Text style={[styles.label, { color: colors.secondaryText }]}>Category</Text>
        <Text style={[styles.value, { color: colors.text }]}>{task.category || 'Not specified'}</Text>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <Text style={[styles.label, { color: colors.secondaryText }]}>Priority</Text>
        <View style={[
          styles.priorityBadge,
          task.priority === 'high' && styles.highPriority,
          task.priority === 'medium' && styles.mediumPriority,
          task.priority === 'low' && styles.lowPriority,
        ]}>
          <Text style={styles.priorityText}>{task.priority.toUpperCase()}</Text>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <Text style={[styles.label, { color: colors.secondaryText }]}>Start Date</Text>
        <Text style={[styles.value, { color: colors.text }]}>{moment(task.startDate).format('DD MMM YYYY')}</Text>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <Text style={[styles.label, { color: colors.secondaryText }]}>Due Date</Text>
        <Text style={[styles.value, { color: colors.text }]}>{moment(task.dueDate).format('DD MMM YYYY')}</Text>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <Text style={[styles.label, { color: colors.secondaryText }]}>Created At</Text>
        <Text style={[styles.value, { color: colors.text }]}>{moment(task.createdAt).format('DD MMM YYYY, hh:mm A')}</Text>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <Text style={[styles.label, { color: colors.secondaryText }]}>Last Updated</Text>
        <Text style={[styles.value, { color: colors.text }]}>{moment(task.updatedAt).format('DD MMM YYYY, hh:mm A')}</Text>
      </View>
      {task.status !== 'completed' && (
        <TouchableOpacity
          style={[styles.completeButton, { backgroundColor: colors.primary }]}
          onPress={handleMarkCompleted}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
          <Text style={styles.completeButtonText}>Mark as Completed</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={[styles.editButton, { backgroundColor: colors.primary }]}
        onPress={handleEdit}
      >
        <Ionicons name="create-outline" size={20} color="#FFFFFF" />
        <Text style={styles.editButtonText}>Edit Task</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.deleteButton, { backgroundColor: colors.card, borderColor: colors.danger }]}
        onPress={handleDelete}
      >
        <Ionicons name="trash-outline" size={20} color={colors.danger} />
        <Text style={[styles.deleteButtonText, { color: colors.danger }]}>Delete Task</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default TaskDetailsScreen;