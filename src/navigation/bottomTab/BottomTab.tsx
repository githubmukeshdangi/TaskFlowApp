import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Dashboard from '../../screens/dashboard/DashBoard';
import { BottomTabParams } from './bottmTabParams';
import TaskListScreen from '../../screens/taskList/TaskListScreen';
import SettingsScreen from '../../screens/setting/SettingsScreen';
import { useTheme } from '../../context/ThemeContext';
const Tab = createBottomTabNavigator<BottomTabParams>();
export const BottomTab = () => {
  const { colors, isDark } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.secondaryText,
        tabBarStyle: {
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: colors.tabBar,
          borderTopColor: colors.border,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarIcon: ({ color, size }) => {
          let iconName:
            | 'grid-outline'
            | 'checkbox-outline'
            | 'settings-outline';
          switch (route.name) {
            case 'dashboard':
              iconName = 'grid-outline';
              break;
            case 'taskList':
              iconName = 'checkbox-outline';
              break;
            case 'settings':
              iconName = 'settings-outline';
              break;
          }
          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="dashboard"
        component={Dashboard}
      />
      <Tab.Screen
        name="taskList"
        component={TaskListScreen}
      />
      <Tab.Screen
        name="settings"
        component={SettingsScreen}
      />
    </Tab.Navigator>
  );
};