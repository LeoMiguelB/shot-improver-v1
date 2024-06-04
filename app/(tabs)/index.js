import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import CalendarPicker from 'react-native-calendar-picker'
import { useState } from 'react';
import { formatISO } from 'date-fns';
import { openDatabase } from '../db/db';
import { get_workout } from '../db/wc_queries';
import { useEffect } from 'react';


export default function Home() {

  const [currDate, setCurrDate] = useState("")

  const db = openDatabase()

  useEffect(() => {
    if(currDate != "") {
      console.log(currDate != "" && formatISO(currDate, { representation: 'date' }))
      console.log(get_workout(db, currDate))
    }

  }, [currDate])



  return (
    <View style={styles.container}> 
      {/* uses date-fns for dates */}
      <CalendarPicker onDateChange={setCurrDate}/>
      <Link href="/workout" asChild>
        <Pressable>
          <Text>
            workout
          </Text>
        </Pressable>
      </Link>
      <StatusBar style="auto" />
    </View>
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
