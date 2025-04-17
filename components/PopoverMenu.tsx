import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Popover from 'react-native-popover-view';

export function PopoverMenu({ fromRef, visible, onClose, onSelect }: {
  fromRef: React.RefObject<any>;
  visible: boolean;
  onClose: () => void;
  onSelect: (type: 'sms' | 'email') => void;
}) {
  return (
    <Popover
      isVisible={visible}
      from={fromRef}
      onRequestClose={onClose}
      popoverStyle={{
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 6,
        elevation: 5,
      }}>
      <TouchableOpacity onPress={() => onSelect('sms')}>
        <Text style={{ padding: 8 }}>📩 Send via SMS</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onSelect('email')}>
        <Text style={{ padding: 8 }}>✉️ Send via Email</Text>
      </TouchableOpacity>
    </Popover>
  );
}
