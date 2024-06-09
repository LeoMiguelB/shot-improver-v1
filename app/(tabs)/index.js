import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker'
import { useState } from 'react';
import { formatISO } from 'date-fns';
import { Link } from 'expo-router';

export default function Home (){

  const [currDate, setCurrDate] = useState(null)

  return (
    <View style={styles.container}> 
        <CalendarPicker onDateChange={(date) => setCurrDate(formatISO(date, { representation: 'date' }))}/>
        {
          Boolean(currDate)
          &&
          <Link href={{
            pathname: "/data-viewer/[date]",
            params: {date: currDate}
          }}>go somewhere</Link>
        }
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
