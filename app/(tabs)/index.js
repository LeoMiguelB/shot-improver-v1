import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker'
import { useState } from 'react';
import { formatISO } from 'date-fns';
import { get_workout } from '../db/wc_queries';
import { DataViewerTable } from '../../components/DataViewerTable';
import { Button } from 'react-native-paper';
import { useSQLiteContext } from 'expo-sqlite';

export default function Home (){

  const [currDate, setCurrDate] = useState("")

  const [shotData, setShotData] = useState(null)

  const db = useSQLiteContext()

  const handleGetData = async () => {
    console.log("inside handleGetData currDate is:", currDate)
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
