import { Link, Stack, useRouter } from 'expo-router';
import { StyleSheet, View, Text, Button, TouchableOpacity } from 'react-native';
import * as Contacts from 'expo-contacts';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import Friend from '~/app/contacts/addFriends/friend';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ContactsPage() {
  const router = useRouter();
  const [DBfriends, setDBFriends] = useState([]);
  const [userContacts, setUserContacts] = useState<
    {
      name: string;
      phoneNumber: string;
    }[]
  >([]);
  const { mutate, isPending } = useMutation({
    mutationFn: async ({ phoneNumbers }: { phoneNumbers: string[] }) => {
      return await fetch(`https://test.key-jack.com/contacts/friends`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ phoneNumbers }),
      }).then((res) => res.json());
    },
    onSuccess: (data) => setDBFriends(data),
    onError: (err) => console.error('error：', err),
  });

  const getContactNameByPhone = (phone: string) => {
    const contact = userContacts.find((c) => c.phoneNumber === phone);
    return contact?.name ?? '';
  };

  // const handleGetContacts = useCallback(async () => {
  //   const contacts = await getContacts();
  //   setUserContacts(contacts);
  //   const phoneNumbers = contacts.map((contact) => contact.phoneNumber);
  //
  //   if (phoneNumbers.length > 0) {
  //     mutate({ phoneNumbers });
  //   } else {
  //     console.log('未获取到手机号');
  //   }
  // }, []);

  useEffect(() => {
    const fetchContacts = async () => {
      const contacts = await getContacts();
      setUserContacts(contacts);
      const phoneNumbers = contacts.map((contact) => contact.phoneNumber);

      if (phoneNumbers.length > 0) {
        mutate({ phoneNumbers });
      } else {
        console.log('未获取到手机号');
      }
    };

    fetchContacts();
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: 'contacts' }} />
      <View className={"flex flex-row px-4 justify-between py-5 w-full bg-black/5 gap-x-1 gap-y-1"}>
        <View className={"size-20 bg-white rounded-lg"}>
          <View className={"w-full h-full items-center justify-center gap-y-2"}>
            <Ionicons name="chatbox" size={24} color="black" />
            <Text>Create</Text>
          </View>
        </View>
        <View className={"size-20 bg-white rounded-lg"}>
          <View className={"w-full h-full items-center justify-center gap-y-2"}>
            <FontAwesome6 name="user-group" size={24} color="black" />
            <Text>Group ID</Text>
          </View>
        </View>
        <View className={"size-20 bg-white rounded-lg"}>
          <View className={"w-full h-full items-center justify-center gap-y-2"}>
            <MaterialIcons name="numbers" size={24} color="black" />
            <Text>iGrest ID</Text>
          </View>
        </View>
        <View className={"size-20 bg-white rounded-lg"}>
          <View className={"w-full h-full items-center justify-center gap-y-2"}>
            <AntDesign name="qrcode" size={24} color="black" />
            <Text>QRCode</Text>
          </View>
        </View>
        <View className={"size-20 bg-white rounded-lg"}>
          <Link
            href={{
              pathname: '/contacts/addFriends',
              params: { contacts: JSON.stringify(userContacts) },
            }} asChild>
            <TouchableOpacity className={"w-full h-full items-center justify-center gap-y-2"}>
              <AntDesign name="contacts" size={24} color="black" />
              <Text>Contacts</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
      <View >
        {/*<Text>访问用户通讯录</Text>*/}
        {/*<Button title={'访问通讯录'} onPress={() => handleGetContacts()} />*/}


        <View className={"py-4 w-full"}>
          <Text className={"font-bold  left-6"}>People you may know</Text>
          <View>
            {DBfriends.map((friend: { phone: string; nickname: string; avatar: string }) => (
              <Friend
                key={friend.phone}
                avatar={friend.avatar}
                nickname={friend.nickname}
                contact_name={getContactNameByPhone(friend.phone)}
              />
            ))}
          </View>
        </View>
        <View className={"w-full px-5 "}>
          <View className={"p-5 bg-yellow-300 rounded-lg"}>
            <Text>This list will search for users who have registered igest based on the mobile phone number <Text style={{ textDecorationLine: 'line-through' }}>(Email)</Text> in the address book. It is convenient to add friends.</Text>
          </View>

        </View>

      </View>
    </>
  );
}

export const getContacts = async () => {
  const { status } = await Contacts.requestPermissionsAsync();

  if (status !== 'granted') {
    console.log('通讯录访问权限被拒绝');
    return [];
  }

  const { data } = await Contacts.getContactsAsync({
    fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
  });

  if (!data || data.length === 0) {
    console.log('没有联系人数据');
    return [];
  }

  // const contactsWithPhone = data.filter(
  //   (contact) => contact.phoneNumbers && contact.phoneNumbers.length > 0
  // );

  const contacts = data.flatMap((contact) => {
    if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
      const name = `${contact.firstName ?? ''} ${contact.lastName ?? ''}`.trim();
      const phoneNumber = contact.phoneNumbers[0]?.number?.replace(/\D/g, '') ?? '';

      return name && phoneNumber ? [{ name, phoneNumber }] : [];
    }
    return [];
  });

  return contacts;
};
