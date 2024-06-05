import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Link } from 'expo-router';
import CalendarPicker from 'react-native-calendar-picker'
import { useState } from 'react';
import { formatISO } from 'date-fns';
import { openDatabase } from '../db/db';
import { get_workout } from '../db/wc_queries';
import { useEffect } from 'react';
import { DataViewerTable } from '../../components/DataViewerTable';
import { Button } from 'react-native-paper';


export default function Home() {

  const [currDate, setCurrDate] = useState("")

  const [shotData, setShotData] = useState(null)

  const db = openDatabase()
  
  const handleGetData = async () => {
    const workout_sheet = await get_workout(db, currDate)
    setShotData(workout_sheet)
  }

  return (
    <View style={styles.container}> 
      {/* uses date-fns for dates */}

      {
        Boolean(shotData) 
        ?
        <DataViewerTable shotData={shotData} />
        :
        <>
          <CalendarPicker onDateChange={(date) => setCurrDate(formatISO(date, { representation: 'date' }))}/>
          <Button onPress={handleGetData}>View</Button>
        </>
      }

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});
