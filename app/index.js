import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker'
import { useState } from 'react';
import { formatISO } from 'date-fns';
import { Link } from 'expo-router';
import { Button } from 'react-native-paper';

export default function Home (){

  const [currDate, setCurrDate] = useState(null)

  return (
    <View style={styles.container}> 
      <CalendarPicker onDateChange={(date) => setCurrDate(formatISO(date, { representation: 'date' }))}/>
      <View style={styles.buttonContainer}>
        <Link 
          href={{
            pathname: Boolean(currDate) ? "/[date]" : "#",
            params: {date: currDate}
          }}
        >
          <Button 
            mode='contained-tonal'
            disabled={!Boolean(currDate)}
          >
            view workout ({Boolean(currDate) && currDate})
          </Button>
        </Link>
        <Link
          href={{
            pathname: '/workout-form'
          }}
        >
          <Button 
            mode='contained-tonal'
            disabled={!Boolean(currDate)}
          >
            insert workout ({formatISO(new Date(), { representation: 'date' })})
          </Button>
        </Link>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
    alignItems: 'center',
  },
  buttonContainer: {
    gap: 10,
    flex: 1,
    alignContent: 'center',
  }
});
