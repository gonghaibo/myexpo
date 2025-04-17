import React from 'react';
import {
  StatusBar,
  useColorScheme,
  View,
  Platform,
  StyleSheet,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

type Props = {
  children: React.ReactNode;
};

export default function AppSafeArea({ children }: Props) {
  const theme = useColorScheme();
  const insets = useSafeAreaInsets();

  const backgroundColor = theme === 'dark' ? '#000' : '#fff';
  const barStyle = theme === 'dark' ? 'light-content' : 'dark-content';

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <StatusBar
        barStyle={barStyle}
        backgroundColor={backgroundColor}
        translucent={Platform.OS === 'android'} // ✅ 让安卓透明好看点
      />

      <SafeAreaView edges={['top']} style={{ backgroundColor }} />
      <View style={[styles.content, { paddingBottom: insets.bottom }]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});
