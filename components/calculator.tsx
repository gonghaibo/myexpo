import React, { useState } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';
import { evaluate } from 'mathjs';

export default function Calculator() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isResultCalculated, setIsResultCalculated] = useState(false);

  const handlePress = (value: string) => {
    if (isResultCalculated) {
      setInput(value);
      setIsResultCalculated(false);
    } else {
      setInput((prevInput) => prevInput + value);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setIsResultCalculated(false);
  };

  const handleCalculate = () => {
    try {
      const result = evaluate(input);
      setOutput(result.toString());
      setIsResultCalculated(true);
    } catch (error) {
      setOutput('Error');
      setIsResultCalculated(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-100 p-4">
      {/* Screen */}
      <View className="w-full p-4 bg-white rounded-lg shadow-md mb-4 items-end">
        <Text className="text-xl text-gray-600">{input}</Text>
        <Text className="text-3xl font-bold text-gray-800">{output}</Text>
      </View>

      <View className="w-full">
        <View className="flex flex-row justify-between mb-4">
          <Button label="7" onPress={handlePress} />
          <Button label="8" onPress={handlePress} />
          <Button label="9" onPress={handlePress} />
          <Button label="/" onPress={handlePress} />
        </View>

        <View className="flex flex-row justify-between mb-4">
          <Button label="4" onPress={handlePress} />
          <Button label="5" onPress={handlePress} />
          <Button label="6" onPress={handlePress} />
          <Button label="*" onPress={handlePress} />
        </View>

        <View className="flex flex-row justify-between mb-4">
          <Button label="1" onPress={handlePress} />
          <Button label="2" onPress={handlePress} />
          <Button label="3" onPress={handlePress} />
          <Button label="-" onPress={handlePress} />
        </View>

        <View className="flex flex-row justify-between mb-4">
          <Button label="0" onPress={handlePress} />
          <Button label="." onPress={handlePress} />
          <Button label="C" onPress={handleClear} />
          <Button label="+" onPress={handlePress} />
        </View>

        <View className="flex flex-row justify-between">
          <Button label="=" onPress={handleCalculate} />
        </View>
      </View>
    </View>
  );
}

const Button = ({ label, onPress }: { label: string; onPress: (value: string) => void }) => (
  <TouchableOpacity
    className="w-1/4 py-4 bg-gray-200 rounded-lg items-center justify-center shadow-md"
    onPress={() => onPress(label)}
  >
    <Text className="text-lg text-gray-800">{label}</Text>
  </TouchableOpacity>
);
