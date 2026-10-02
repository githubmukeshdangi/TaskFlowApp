import React from 'react';
import RootStack from './src/navigation/stacks/RootStack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/context/ThemeContext';
const App = () => {
  return (
    <ThemeProvider>
      <SafeAreaView style={{ flex: 1 }} edges={[ 'left', 'right', 'bottom']}>
        <RootStack />
      </SafeAreaView>
    </ThemeProvider>
  );
};
export default App;