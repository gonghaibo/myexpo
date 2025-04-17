import Chevronleft from 'assets/chevronleft.svg';
import { Link, Stack, useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  Platform,
  View,
  Text,
  SectionList,
  TextInput,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
  Animated,
} from 'react-native';
import { ContactItem } from './ContactItem';

type Contact = {
  name: string;
  phoneNumber: string;
  avatar?: string;
  email?: string;
  image?: string;
};

export default function Page() {
  const params = useLocalSearchParams();
  const [query, setQuery] = useState('');
  const sectionListRef = useRef<SectionList>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [activePopoverId, setActivePopoverId] = useState<string | null>(null);
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const router = useRouter();
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

  const alphabetIndex = useMemo(() => {
    return groupedContacts.map((section) => section.title);
  }, [groupedContacts]);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    const firstVisibleSection = viewableItems.find(
      (item: any) => item.section && item.index === null // 说明是 Section Header
    );
    if (firstVisibleSection?.section?.title) {
      setActiveLetter(firstVisibleSection.section.title);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
    waitForInteraction: true,
  }).current;

  return (
    <View className={'bg-white'}>
      <Stack.Screen
        options={{
          title: 'Contacts',
          headerBackTitle: '',
          headerBackVisible: false,
          headerShadowVisible: false,
          // headerStyle: {
          //   backgroundColor: '#f8f8f8',
          // },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Chevronleft width={18} height={18} />
            </TouchableOpacity>
          ),
        }}
      />
      <StatusBar style={Platform.OS === 'ios' ? 'dark' : 'auto'} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View className="h-14 flex-row items-center bg-white px-4 py-2">
          <Animated.View style={{ flex: inputFlex }} className={isSearching ? 'mr-3' : ''}>
            <TextInput
              placeholder="Search contacts"
              value={query}
              onChangeText={setQuery}
              onFocus={() => {
                setIsSearching(true);
              }}
              onBlur={() => {
                if (!query) {
                  setIsSearching(false);
                }
              }}
              style={{
                backgroundColor: '#f3f4f6',
                borderRadius: 6,
                paddingHorizontal: 12,
                height: 36,
                fontSize: 16,
                paddingVertical: 0,
                textAlignVertical: 'center',
                textAlign: 'left',
                includeFontPadding: false,
                width: '100%',
              }}
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
        ref={sectionListRef}
        sections={groupedContacts}
        keyExtractor={(item, index) => `${item.name}-${item.phoneNumber}-${index}`}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        renderItem={({ item }) => (
          <ContactItem
            name={item.name}
            phoneNumber={item.phoneNumber}
            email={item.email}
            image={item.image}
            activePopoverId={activePopoverId}
            setActivePopoverId={setActivePopoverId}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text className="z-20 border-b border-black/5 bg-white/95 px-4 text-lg font-bold">
            {title}
          </Text>
        )}
        contentContainerStyle={{ backgroundColor: 'white' }}
        stickySectionHeadersEnabled
      />
      <View className="-translate-y-1/2' absolute right-3 top-1/2 transform">
        {groupedContacts.map((section, index) => (
          <TouchableOpacity
            key={section.title}
            onPress={() => {
              sectionListRef.current?.scrollToLocation({
                sectionIndex: index,
                itemIndex: 0,
                animated: true,
              });
            }}>
            <Text className={`py-1 text-xs font-bold text-gray-400`}>{section.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
