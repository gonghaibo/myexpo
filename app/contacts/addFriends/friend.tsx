import { View, Text, Image, StyleSheet, Platform } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Friend({
  avatar,
  nickname,
  contact_name,
}: {
  avatar: string;
  nickname: string;
  contact_name: string;
}) {
  return (
    <View className="flex-row border-b border-black/5 items-center justify-between p-4 gap-x-4 rounded-2xl">
      <View className={"flex flex-row items-center gap-x-4"}>
        <Image source={{ uri: avatar }} className="size-14 rounded-full" />
        <View className="flex flex-col p-2 rounded">
          <Text>{nickname}</Text>
          <Text className="text-xl font-bold">({contact_name})</Text>
        </View>
      </View>
      <View className={"flex flex-row items-center gap-x-4"}>
        <Ionicons name="person-add" size={24} color="blue" />
        <MaterialCommunityIcons name="message" size={24} color="blue" />
      </View>
    </View>
  );
}
