import React from 'react';
import { View, StatusBar } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
const AppStatusBar = () => {
  const { colors, isDark } = useTheme();
  return (
    <View style={{ height: 35, backgroundColor: colors.background }}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
        translucent={false}
      />
    </View>
  );
};
export default AppStatusBar;