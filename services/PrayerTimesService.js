// PrayerTimesService.js
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const fetchPrayerTimes = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Permission to access location was denied');
  }

  let { coords } = await Location.getCurrentPositionAsync({});
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // JavaScript months are 0-based.

  const response = await fetch(`https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${coords.latitude}&longitude=${coords.longitude}`);
  const json = await response.json();
  return json;
};

const storePrayerTimes = async (data) => {
  const now = new Date();
  const month = now.getMonth() + 1; // JavaScript months are 0-based.
  const storageKey = `prayerTimes_${month}`;
  await AsyncStorage.setItem(storageKey, JSON.stringify(data));
};

const getPrayerTimes = async () => {
  const now = new Date();
  const month = now.getMonth() + 1; // JavaScript months are 0-based.
  const storageKey = `prayerTimes_${month}`;
  const storedData = await AsyncStorage.getItem(storageKey);
  if (storedData) {
    return JSON.parse(storedData);
  }

  const newData = await fetchPrayerTimes();
  await storePrayerTimes(newData);
  return newData;
};

export { getPrayerTimes };
