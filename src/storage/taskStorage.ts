import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '../screens/addEditTask/addEditTaskProps';

const TASK_STORAGE_KEY = '@taskflow_tasks';

export const getTasks = async () => {
  try {
    const storedTasks = await AsyncStorage.getItem(TASK_STORAGE_KEY);
    if (!storedTasks) {
      return [];
    }
    return JSON.parse(storedTasks) ;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
};

export const saveTasks = async (tasks: Task[]) => {
  try {
    await AsyncStorage.setItem(
      TASK_STORAGE_KEY,
      JSON.stringify(tasks),
    );
  } catch (error) {
    console.error('Error saving tasks:', error);
  }
};

export const addTask = async (task: Task) => {
  const tasks = await getTasks();
  await saveTasks([task, ...tasks]);
};

export const updateTask = async (updatedTask: Task) => {
  const tasks = await getTasks();
  const updatedTasks = tasks.map((task: Task) =>
    task.id === updatedTask.id ? updatedTask : task,
  );
  await saveTasks(updatedTasks);
};

export const deleteTask = async (taskId: string) => {
  const tasks = await getTasks();
  const updatedTasks = tasks.filter((task: Task) => task.id !== taskId);
  await saveTasks(updatedTasks);
};


export const clearAllTasks = async () => {
  try {
    await AsyncStorage.removeItem(TASK_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing tasks:', error);
    return false;
  }
};