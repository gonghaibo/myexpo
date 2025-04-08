// app/calendar/index.tsx
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { cn } from "~/utils/cn";
import { Picker } from "@react-native-picker/picker";

const years = Array.from({ length: 10 }, (_, i) => 2020 + i);
const months = Array.from({ length: 12 }, (_, i) =>
  format(new Date(2000, i), 'MMMM')
);

export default function CalendarPage() {
  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth()); // 0-11

  const currentDate = new Date(selectedYear, selectedMonth);
  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  return (
    <View className="flex-1 flex-row p-4">
      <View className="flex-1">
        <Text className="text-xl mb-2 font-bold">
          {format(currentDate, 'MMMM yyyy')}
        </Text>
        <View className="flex flex-wrap flex-row">
          {days.map((day) => (
            <TouchableOpacity
              key={day.toISOString()}
              className="w-[14.28%] h-16 items-center justify-center border"
            >
              <Text className="text-sm">{format(day, 'd')}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View className="w-40 ml-4">
        <Text className="text-base font-semibold mb-2">选择年份</Text>
        <Picker
          selectedValue={selectedYear}
          onValueChange={(itemValue) => setSelectedYear(itemValue)}
          style={{ height: 50 }}
        >
          {years.map((year) => (
            <Picker.Item key={year} label={year.toString()} value={year} />
          ))}
        </Picker>

        <Text className="mt-4 font-semibold mb-2">选择月份</Text>
        <ScrollView>
          {months.map((month, index) => (
            <TouchableOpacity
              key={month}
              onPress={() => setSelectedMonth(index)}
              className={cn(
                'p-2 rounded mb-1',
                index === selectedMonth ? 'bg-blue-500' : 'bg-white'
              )}
            >
              <Text className={cn(index === selectedMonth ? 'text-white' : 'text-black')}>
                {month}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}