import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,ScrollView, SafeAreaView } from 'react-native';
import React, { useState, useEffect } from 'react';


export default function App() {
  const getCurrentDateAndTime = () => {
    const now = new Date();
  
    const date = now.getDate();
    const month = (now.getMonth()+1);
    const year = now.getFullYear();
    const time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
  
    return { date, time,year,month };
  };
  const { date, time,month,year} = getCurrentDateAndTime();
  const [data, setData] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=25.285446&longitude=51.531040`);
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  console.log(month)

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' ,backgroundColor:"plum" }}>
    {data ? (
      <ScrollView>
        {data.data.map((day, index) => (
          <View key={index} style={{ margin: 10, padding: 10, borderWidth: 1, borderColor: '#ddd' ,backgroundColor:"red"}}>
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
      <Text>Loading...</Text>
    )}
  </SafeAreaView>
  );	
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
