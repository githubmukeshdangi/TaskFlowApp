import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StatusBar, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { clearAllTasks } from '../../storage/taskStorage';
import { useTheme } from '../../context/ThemeContext';
import { styles } from './settingScreen.style';
const SettingsScreen = () => {
  const [isClearing, setIsClearing] = useState(false);
  const { theme, colors, toggleTheme, isDark } = useTheme();
  const handleClearAllTasks = () => {
    Alert.alert(
      'Clear All Tasks',
      'Are you sure you want to delete all tasks? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            setIsClearing(true);
            const success = await clearAllTasks();
            setIsClearing(false);
            if (success) {
              Alert.alert('Success', 'All tasks have been deleted successfully.');
            } else {
              Alert.alert('Error', 'Unable to clear tasks. Please try again.');
            }
          },
        },
      ],
    );
  };
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Settings</Text>
      <Text style={[styles.subtitle, { color: colors.secondaryText }]}>Manage your application preferences</Text>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>General</Text>
        <View style={[styles.settingCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.settingInfo}>
            <Ionicons name="moon-outline" size={22} color={colors.primary} />
            <View style={styles.settingText}>
              <Text style={[styles.settingTitle, { color: colors.text }]}>Appearance</Text>
              <Text style={[styles.settingDescription, { color: colors.secondaryText }]}>{isDark ? 'Dark Mode' : 'Light Mode'}</Text>
            </View>
          </View>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{ false: '#CBD5E1', true: colors.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Data Management</Text>
        <TouchableOpacity
          style={[styles.dangerCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          onPress={handleClearAllTasks}
          disabled={isClearing}
          activeOpacity={0.7}
        >
          <View style={styles.settingInfo}>
            <Ionicons name="trash-outline" size={22} color={colors.danger} />
            <View style={styles.settingText}>
              <Text style={[styles.dangerTitle, { color: colors.danger }]}>{isClearing ? 'Clearing...' : 'Clear All Tasks'}</Text>
              <Text style={[styles.settingDescription, { color: colors.secondaryText }]}>Permanently delete all saved tasks</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.danger} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default SettingsScreen;