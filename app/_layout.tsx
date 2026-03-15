import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavThemeProvider,
} from '@react-navigation/native';
import * as NavigationBar from 'expo-navigation-bar';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import Toast from '@/components/ui/Toast';
import { ThemeProvider, useAppTheme } from '@/context/ThemeContext';

export const unstable_settings = {
  anchor: '(tabs)',
};

function NavigationThemeAdapter({ children }: { children: React.ReactNode }) {
  const { scheme } = useAppTheme();

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    if (scheme === 'light') {
      NavigationBar.setBackgroundColorAsync('#FFFFFF');
      NavigationBar.setButtonStyleAsync('dark');
    } else {
      NavigationBar.setBackgroundColorAsync('#111420');
      NavigationBar.setButtonStyleAsync('light');
    }
  }, [scheme]);

  return (
    <NavThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} translucent backgroundColor="transparent" />
      {children}
    </NavThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <NavigationThemeAdapter>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
          <Toast />
        </NavigationThemeAdapter>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
