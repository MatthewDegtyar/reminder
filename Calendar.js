import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import moment from 'moment';

export default function CalendarDisplay() {
  const [currentMonth, setCurrentMonth] = useState(moment().month());
  const [currentYear, setCurrentYear] = useState(moment().year());

  const getDaysInMonth = (month, year) => {
    const daysInMonth = moment(`${year}-${month + 1}`, 'YYYY-MM').daysInMonth();
    const firstDayOfMonth = moment(`${year}-${month + 1}-01`, 'YYYY-MM-DD').day();

    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const handlePrevMonth = () => {
    setCurrentMonth(currentMonth - 1);

    if (currentMonth === 0) {
      setCurrentYear(currentYear - 1);
      setCurrentMonth(11);
    }
  };

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth + 1);

    if (currentMonth === 11) {
      setCurrentYear(currentYear + 1);
      setCurrentMonth(0);
    }
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePrevMonth}>
          <Text>Previous Month</Text>
        </TouchableOpacity>
        <Text>{moment(`${currentYear}-${currentMonth + 1}`, 'YYYY-MM').format('MMMM YYYY')}</Text>
        <TouchableOpacity onPress={handleNextMonth}>
          <Text>Next Month</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.calendar}>
        <View style={styles.weekDays}>
          <Text style={styles.weekDay}>Sun</Text>
          <Text style={styles.weekDay}>Mon</Text>
          <Text style={styles.weekDay}>Tue</Text>
          <Text style={styles.weekDay}>Wed</Text>
          <Text style={styles.weekDay}>Thu</Text>
          <Text style={styles.weekDay}>Fri</Text>
          <Text style={styles.weekDay}>Sat</Text>
        </View>
        <View style={styles.days}>
          {daysInMonth.map((day, index) => (
            <TouchableOpacity key={index} style={styles.dayButton} onPress={() => console.log(day)}>
              <Text style={day ? styles.day : styles.emptyDay}>{day}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calendar: {
    marginTop: 20,
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
  },
  days: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayButton: {
    width: '14.28%', // 7 days in a week, so 100/7 = 14
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  day: {
    textAlign: 'center',
  },
  emptyDay: {
    opacity: 0,
  },
});
