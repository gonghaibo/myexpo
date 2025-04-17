import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
};

const hashToColor = (hash: number): string => {
  const r = (hash & 0xFF0000) >> 16;
  const g = (hash & 0x00FF00) >> 8;
  const b = hash & 0x0000FF;
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

interface RandomAvatarProps {
  text: string;
}

const RandomAvatar: React.FC<RandomAvatarProps> = ({ text }) => {
  const firstChar = text ? text.charAt(0) : '';
  const hash = hashString(text);
  const backgroundColor = hashToColor(hash);

  return (
    <View style={[styles.avatar, { backgroundColor }]}>
      <Text style={styles.text}>{firstChar}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: 'white',
    fontSize: 24
  }
});

export default RandomAvatar;