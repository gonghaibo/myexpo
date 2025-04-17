import Envelope from 'assets/envelope.svg'
import Message from 'assets/message.svg'
import { BlurView } from 'expo-blur';
import * as MailComposer from 'expo-mail-composer';
import { Stack, useLocalSearchParams, useNavigation } from 'expo-router';
import * as SMS from 'expo-sms';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  Platform,
  View,
  Text,
  Alert,
  SectionList,
  Image,
  TextInput,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
  Animated,
  Pressable,
} from 'react-native';
import Popover from 'react-native-popover-view';

type Contact = { name: string; phoneNumber: string; avatar?: string,  email?: string };

type ContactItemProps = Contact & {
  activePopoverId: string | null;
  setActivePopoverId: (id: string | null) => void;
};

export default function Page() {
  const params = useLocalSearchParams();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [activePopoverId, setActivePopoverId] = useState<string | null>(null);
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: !isSearching,
    });
  }, [isSearching]);

  const inputFlex = useState(new Animated.Value(1))[0];
  useEffect(() => {
    Animated.timing(inputFlex, {
      toValue: isSearching ? 0.99 : 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isSearching]);

  const contacts: Contact[] = useMemo(() => {
    try {
      const parsed = JSON.parse(params.contacts as string) as unknown;

      if (Array.isArray(parsed)) {
        return parsed.filter(
          (item): item is Contact =>
            typeof item.name === 'string' && typeof item.phoneNumber === 'string'
        );
      }

      return [];
    } catch (e) {
      return [];
    }
  }, [params.contacts]);

  const filteredContacts = useMemo(() => {
    if (!query.trim()) return contacts;
    const lower = query.toLowerCase();
    return contacts.filter(
      (contact) => contact.name.toLowerCase().includes(lower) || contact.phoneNumber.includes(lower)
    );
  }, [contacts, query]);

  const groupedContacts = useMemo(() => {
    const grouped: Record<string, Contact[]> = {};

    filteredContacts.forEach((contact) => {
      const firstChar = contact.name.trim().charAt(0).toUpperCase();
      const groupKey = /[A-Z]/.test(firstChar) ? firstChar : '#';

      if (!grouped[groupKey]) grouped[groupKey] = [];
      grouped[groupKey].push(contact);
    });

    return Object.keys(grouped)
      .sort((a, b) => (a === '#' ? 1 : b === '#' ? -1 : a.localeCompare(b)))
      .map((letter) => ({
        title: letter,
        data: grouped[letter].sort((a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN')),
      }));
  }, [filteredContacts]);

  return (
    <>
      <Stack.Screen options={{ title: 'Contacts', headerBackTitle: 'Back' }} />
      <StatusBar style={Platform.OS === 'ios' ? 'dark' : 'auto'} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View className="h-14 flex-row items-center border-b border-black/5 bg-white px-4 py-2">
          <Animated.View style={{ flex: inputFlex }} className={isSearching ? 'mr-3' : ''}>
            <TextInput
              placeholder="Search contacts..."
              value={query}
              onChangeText={setQuery}
              onFocus={() => setIsSearching(true)}
              style={{
                backgroundColor: '#f3f4f6',
                borderRadius: 6,
                paddingHorizontal: 12,
                height: 36,
                fontSize: 16,
                paddingVertical: 0,
                textAlignVertical: 'center',
                includeFontPadding: false,
                width: '100%',
              }}
              className="text-base"
            />
          </Animated.View>

          {isSearching && (
            <TouchableOpacity
              onPress={() => {
                setQuery('');
                setIsSearching(false);
                Keyboard.dismiss();
              }}>
              <Text className="font-semibold text-blue-500">Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>

      <SectionList
        sections={groupedContacts}
        keyExtractor={(item, index) => `${item.name}-${item.phoneNumber}-${index}`}
        renderItem={({ item }) => (
          <View className="z-10">
            <ContactItem
              name={item.name}
              phoneNumber={item.phoneNumber}
              email={item.email}
              activePopoverId={activePopoverId}
              setActivePopoverId={setActivePopoverId}
            />
          </View>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text className="border-b border-black/10 bg-white px-4 text-lg font-bold">{title}</Text>
        )}
        contentContainerStyle={{ backgroundColor: 'white' }}
        stickySectionHeadersEnabled
      />
    </>
  );
}

function ContactItem({ name, phoneNumber,email, activePopoverId, setActivePopoverId }: ContactItemProps) {
  const invitationRef = useRef(null);
  const id = phoneNumber;
  const isVisible = activePopoverId === id;

  const sendSMS = async () => {
    const isAvailable = await SMS.isAvailableAsync();

    if (!isAvailable) {
      Alert.alert(
        'Unable to send SMS',
        'This device does not support SMS functionality or is not properly configured.'
      );
      return;
    }

    const message = `Hi ${name}, I'm using iGest, an amazing app! Join me by downloading it here, or copy the link: https://ig.co/i=xswf. Add me as a friend!`;

    const { result } = await SMS.sendSMSAsync([phoneNumber], message);
    console.log(`${name} The result of the SMS sending:`, result);
    setActivePopoverId(null);
  };

  const sendEmail = async () => {
    const isAvailable = await MailComposer.isAvailableAsync();
    if (!email) {
      return;
    }

    if (!isAvailable) {
      Alert.alert(
        'Unable to send Email',
        'This device does not support email functionality or is not properly configured.'
      );
      return;
    }

    const subject = 'Join me on iGest!';
    const body = `Hi ${name},\n\nI'm using iGest, an amazing app! Join me by downloading it here, or copy the link: https://ig.co/i=xswf. Add me as a friend!`;
    const recipients = [email];

    const result = await MailComposer.composeAsync({
      recipients,
      subject,
      body,
    });

    console.log(`${name} The result of the email sending:`, result);
    setActivePopoverId(null);
  };


  return (
    <View className="ml-4 flex w-fit flex-row items-center justify-between border-b border-black/10 bg-white py-3 pr-4">
      <View className="flex flex-row items-center gap-x-2">
        <Image
          source={{
            uri: 'https://avatars.steamstatic.com/108a43194ce80bfdd8e34ff24668fcdc0ff08161_full.jpg',
          }}
          className="size-12 rounded-md"
        />
        <View className="justify-center">
          <Text className="text-xl font-semibold">{name}</Text>
          <Text className="text-sm text-gray-500">{phoneNumber}</Text>
        </View>
      </View>
      <TouchableOpacity
        ref={invitationRef}
        // onPress={sendSMS}
        onPress={() => {
          setActivePopoverId(isVisible ? null : id);
        }}
        className="rounded-md bg-black px-4 py-2 mr-4">
        <Text className="text-sm font-medium text-white">Invitation</Text>
      </TouchableOpacity>

      <Popover
        isVisible={isVisible}
        from={invitationRef}
        onRequestClose={() => setActivePopoverId(null)}
        backgroundStyle={{ backgroundColor: 'transparent' }}
        popoverStyle={{
          backgroundColor: 'transparent',
          borderRadius: 12,
          minWidth: 160,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 8,
        }}
        arrowSize={{ width: 0, height: 0 }}>
        <BlurView
          intensity={30}
          tint="light"
          style={{
            minWidth: 248,
            borderRadius: 12,
            overflow: 'hidden',
            backgroundColor: 'rgba(255, 255, 255, 0.90)',
          }}
        >
          {phoneNumber && (
            <Pressable
              onPress={sendSMS}
              className="h-12 px-4 py-3 flex flex-row items-center justify-between">
              <Text className="text-base font-medium">Send via Message</Text>
              <Message width={24} height={24} />
            </Pressable>
          )}

          {email && (
            <>
              <View className="h-px bg-[#E0E0E0]" />
              <Pressable
                onPress={sendEmail}
                className="h-12 px-4 py-3 flex flex-row items-center justify-between">
                <Text className="text-base font-medium">Send via Email</Text>
                <Envelope width={24} height={24} />
              </Pressable>
            </>
          )}
        </BlurView>
      </Popover>
    </View>
  );
}
