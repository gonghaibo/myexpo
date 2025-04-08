import { Stack } from 'expo-router';
import { StyleSheet, View, Text } from 'react-native';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';

export default function Time() {
  const [serverTime, setServerTime] = useState<string>('');

  useEffect(() => {
    const eventSource = new EventSource('https://test.key-jack.com/sse/events');

    eventSource.onmessage = function (event) {
      const serverTime = event.data;
      const formattedTime = format(new Date(serverTime), 'yyyy-MM-dd HH:mm:ss');
      setServerTime(formattedTime);
    };

    eventSource.onerror = function (error) {
      console.error('EventSource failed:', error);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: '从服务器获取时间' }} />
      <View style={styles.container}>
        <Text>当前服务器时间是: {serverTime || '加载中...'}</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
