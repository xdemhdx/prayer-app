import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, SafeAreaView } from 'react-native';
import React, { useState, useEffect, lazy } from 'react';
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [data, setData] = useState(null);
  const db={"name":"ali","age":21}

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
    })();
  }, []);

  useEffect(() => {
    if (location) {
      const fetchData = async () => {
        try {
          const now = new Date();
          const year = now.getFullYear();
          const month = now.getMonth() + 1; // JavaScript months are 0-based.
          const { latitude, longitude,accuracy } = location;

          const response = await fetch(`https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${latitude}&longitude=${longitude}`);
          const json = await response.json();
          setData(json);
        } catch (error) {
          console.error('Error fetching data: ', error);
          setErrorMsg('Error fetching prayer times');
        }
      };

      fetchData();
    }
  }, [location]);

  let text = 'Waiting for location...';
  if (errorMsg) {
    text = errorMsg;
  } else if (data) {
    text = 'Data loaded';
  }

  return (
    <SafeAreaView style={styles.container}>
      {data ? (
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
        <Text>{text}</Text>
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
    backgroundColor: 'red',
  },
});
