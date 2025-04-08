import { Stack } from 'expo-router';
import { StyleSheet, Text, View } from "react-native";

import { ScreenContent } from '~/components/ScreenContent';
import { DefaultTheme } from "@react-navigation/native/src";

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: '主页11' }} />
      <View style={styles.container}>
        <Text className={"text-2xl text-red-500 font-bold"}>hello</Text>
        {/*<ScreenContent path="app/(tabs)/index.tsx" title="Tab One" />*/}
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
