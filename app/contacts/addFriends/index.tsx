import { StatusBar } from 'expo-status-bar';
import { Platform, View, Text, Button, Alert, ScrollView } from 'react-native';
import { Stack, useLocalSearchParams } from "expo-router";
import { useMemo } from 'react';
import * as SMS from 'expo-sms';

export default function Page() {
  const params = useLocalSearchParams();

  const contacts = useMemo(() => {
    try {
      return JSON.parse(params.contacts as string);
    } catch (e) {
      return [];
    }
  }, [params.contacts]);

  return (
    <>
      <Stack.Screen options={{ title: 'Contacts', headerBackTitle: 'Back' }} />
      <StatusBar style={Platform.OS === 'ios' ? 'dark' : 'auto'} />
      <ScrollView className="h-full w-full space-y-4 p-4">
        {contacts.map(({ name, phoneNumber }: { name: string; phoneNumber: string }) => (
          <Contact name={name} phoneNumber={phoneNumber} key={name} />
        ))}
      </ScrollView>
    </>
  );
}

function Contact({ name, phoneNumber }: { name: string; phoneNumber: string }) {
  const sendSMS = async () => {
    const isAvailable = await SMS.isAvailableAsync();

    if (!isAvailable) {
      Alert.alert("Unable to send SMS", "This device does not support SMS functionality or is not properly configured.");
      return;
    }

    const message = `Hi ${name}, I'm using iGest, an amazing app! Join me by downloading it here, or copy the link: https://ig.co/i=xswf. Add me as a friend!`;

    const { result } = await SMS.sendSMSAsync([phoneNumber], message);
    console.log(`${name} The result of the SMS sending:`, result);
  };

  return (
    <View className="bg-white p-4 rounded-xl shadow space-y-2 flex flex-row justify-between">
      <View className={"flex flex-row items-center gap-x-4"}>
        <Text className="text-2xl font-bold">{name}</Text>
        {/*<Text className="text-gray-500">{phoneNumber}</Text>*/}
      </View>
      <Button title="Invitation" onPress={sendSMS} />
    </View>
  );
}
