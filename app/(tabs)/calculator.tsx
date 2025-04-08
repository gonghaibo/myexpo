import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ScreenContent } from '~/components/ScreenContent';
import Calculator from "~/components/calculator";

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: '计算器' }} />
      <View style={styles.container}>
        <Calculator/>
        {/*<ScreenContent path="app/(tabs)/two.tsx" title="Tab Two" />*/}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
});
