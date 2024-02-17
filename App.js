// App.js
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView } from 'react-native';
import { getPrayerTimes } from './services/PrayerTimesService'; // Adjust the path as necessary

export default function App() {
  const [data, setData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const prayerTimes = await getPrayerTimes();
        setData(prayerTimes);
      } catch (error) {
        console.error('Error:', error);
        setErrorMsg(error.message || 'Error fetching prayer times');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <Text>Loading...</Text>
      ) : errorMsg ? (
        <Text>{errorMsg}</Text>
      ) : data ? (
        <ScrollView>
          {data.data.map((day, index) => (
            <View key={index} style={styles.dayContainer}>
              <Text>Date: {day.date.readable}</Text>
              <Text>Fajr: {day.timings.Fajr}</Text>
              <Text>Dhuhr: {day.timings.Dhuhr}</Text>
              <Text>Asr: {day.timings.Asr}</Text>
              <Text>Maghrib: {day.timings.Maghrib}</Text>
              <Text>Isha: {day.timings.Isha}</Text>
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text>No data available</Text>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'plum',
  },
  dayContainer: {
    margin: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'snow',
  },
});
