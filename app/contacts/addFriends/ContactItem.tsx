import { useRef } from 'react';
import { Alert, Image, Pressable, Text, TouchableOpacity, View } from 'react-native';
import Popover from 'react-native-popover-view';
import { BlurView } from 'expo-blur';
import * as SMS from 'expo-sms';
import * as MailComposer from 'expo-mail-composer';
import Message from 'assets/message.svg';
import Envelope from 'assets/envelope.svg';
import RandomAvatar from './RandomAvatar';

export type ContactItem = {
  name: string;
  phoneNumber: string;
  avatar?: string;
  email?: string;
  image?: string;
};

type ContactItemProps = ContactItem & {
  activePopoverId: string | null;
  setActivePopoverId: (id: string | null) => void;
};

export function ContactItem({
  name,
  phoneNumber,
  email,
  image,
  activePopoverId,
  setActivePopoverId,
}: ContactItemProps) {
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
    if (!email) return;

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
    <View className="ml-4 flex w-fit flex-row items-center justify-between bg-white py-3 pr-4">
      <View className={'absolute bottom-0 h-px bg-black/5'} style={{ left: 56, right: 28 }} />
      <View className="flex flex-row items-center gap-x-3">
        {image ? (
          <Image source={{ uri: image }} style={{ width: 48, height: 48, borderRadius: 25 }} />
        ) : (
          <RandomAvatar text={name} />
        )}
        <View className="justify-center">
          <Text className="text-xl font-semibold">{name}</Text>
          <Text className="text-sm text-gray-500">{phoneNumber}</Text>
        </View>
      </View>

      <TouchableOpacity
        ref={invitationRef}
        onPress={() => setActivePopoverId(isVisible ? null : id)}
        className="mr-4 rounded-md bg-black px-4 py-2">
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
          }}>
          {phoneNumber && (
            <Pressable
              onPress={sendSMS}
              className="flex h-14 flex-row items-center justify-between px-4 py-3">
              <Text className="text-lg font-medium">Send via Message</Text>
              <Message width={24} height={24} />
            </Pressable>
          )}

          {email && (
            <>
              <View className="h-px bg-[#E0E0E0]" />
              <Pressable
                onPress={sendEmail}
                className="flex h-14 flex-row items-center justify-between px-4 py-3">
                <Text className="text-lg font-medium">Send via Email</Text>
                <Envelope width={24} height={24} />
              </Pressable>
            </>
          )}
        </BlurView>
      </Popover>
    </View>
  );
}
