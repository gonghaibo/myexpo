import { Stack } from 'expo-router';
import { StyleSheet, View, Text } from 'react-native';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import EventSource from 'react-native-sse';
import 'react-native-url-polyfill/auto';

export default function Time() {
  const [serverTime, setServerTime] = useState<string>('');

  useEffect(() => {
    const es = new EventSource('https://test.key-jack.com/sse/events');

    const messageListener = (event: any) => {
      const rawTime = event.data;
      const formattedTime = format(new Date(rawTime), 'yyyy-MM-dd HH:mm:ss');
      setServerTime(formattedTime);
    };

    const errorListener = (event: any) => {
      console.error('sse error:', event.message);
    };

    es.addEventListener('open', () => {
      console.log('sse ok');
    });

    es.addEventListener('message', messageListener);
    es.addEventListener('error', errorListener);

    return () => {
      es.removeAllEventListeners();
      es.close();
    };
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: '从服务器获取时间' }} />
      <View style={styles.container}>
        <Text>当前服务器时间是: {serverTime || '加载中...'}</Text>
        <Text>每5秒更新一次时间</Text>
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
