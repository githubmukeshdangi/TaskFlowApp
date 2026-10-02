import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import { BottomTab } from '../bottomTab/BottomTab';
import AddEditTaskScreen from '../../screens/addEditTask/AddEditTaskScreen';
import TaskDetailsScreen from '../../screens/taskDetails/TaskDetailsScreen';
import BulkUploadScreen from '../../screens/bulkUpload/BulkUploadScreen';
import { useTheme } from '../../context/ThemeContext';
import AppStatusBar from '../../components/common/AppStatusBar';

const Stack = createNativeStackNavigator();

export default function RootStack() {
  const { colors, isDark } = useTheme();
  const navigationTheme = {
    ...(isDark ? DarkTheme : DefaultTheme),
    colors: {
      ...(isDark ? DarkTheme.colors : DefaultTheme.colors),
      background: colors.background,
      card: colors.card,
      text: colors.text,
      border: colors.border,
      primary: colors.primary,
    },
  };
  return (
    <NavigationContainer theme={navigationTheme}>
      <AppStatusBar />
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            color: colors.text,
          },
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen
          name="bottomTab"
          component={BottomTab}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="addEditTask"
          component={AddEditTaskScreen}
          options={{ title: 'Add / Edit Task' }}
        />
        <Stack.Screen
          name="taskDetails"
          component={TaskDetailsScreen}
          options={{ title: 'Task Details' }}
        />
        <Stack.Screen
          name="bulkUpload"
          component={BulkUploadScreen}
          options={{ title: 'Bulk Upload' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}