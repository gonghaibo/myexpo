import * as SMS from 'expo-sms';
import { FlatList, Text, View, TouchableOpacity } from 'react-native';
import { useState } from 'react';

export default function ContactList({
  contacts,
}: {
  contacts: {
    name: string;
    phoneNumber: string;
  }[];
}) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleSendSMS = async (phoneNumber: string) => {
    const isAvailable = await SMS.isAvailableAsync();
    if (!isAvailable) {
      alert('该设备不支持短信功能');
      return;
    }

    const { result } = await SMS.sendSMSAsync(
      [phoneNumber],
      `Hi，我正在使用 iGest，这是一款很棒的应用，你也来试试吧！https://yourapp.com/invite`
    );

    console.log('短信发送结果:', result);
  };

  return (
    <FlatList
      data={contacts}
      keyExtractor={(item) => item.phoneNumber}
      renderItem={({ item }) => (
        <TouchableOpacity
          className="border-b border-gray-200 p-3"
          onPress={() => handleSendSMS(item.phoneNumber)}>
          <Text className="font-bold">{item.name}</Text>
          <Text className="text-gray-500">{item.phoneNumber}</Text>
        </TouchableOpacity>
      )}
    />
  );
}
