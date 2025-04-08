import { Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ScreenContent } from '~/components/ScreenContent';
import Calendar from "~/components/calendar";

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: '日历' }} />
      <View style={styles.container}>
        <Calendar/>
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
