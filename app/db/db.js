/*
the following article was used as a reference - https://medium.com/@julien-ctx/integrating-sqlite-with-react-native-a-beginners-tutorial-a74bbe34ac6a
*/

// using sqlite compatible with expo sdk 50.0
import * as SQLite from 'expo-sqlite';

const db_name = "app.db"
export function openDatabase() {
  return SQLite.openDatabase(db_name);
}

/*
reference:
https://en.wikipedia.org/wiki/Glossary_of_basketball_terms#/media/File:Basketball_terms.png
*/
export const create_tables = async ( db ) => {
  const workoutSheet = `
    CREATE TABLE IF NOT EXISTS WorkoutSheet (
      worksheet_id INTEGER PRIMARY KEY AUTOINCREMENT,
      three_sec_area TEXT,
      left_block TEXT,
      right_block TEXT,
      left_elbow TEXT,
      right_elbow TEXT,
      top_of_circle TEXT,
      left_wing TEXT,
      right_wing TEXT,
      left_corner TEXT,
      right_corner TEXT,
      left_short_corner TEXT,
      right_short_corner TEXT,
      free_throw_line TEXT
    );
  `

  // sqllite date format https://en.wikipedia.org/wiki/ISO_8601
  const workoutCalendar = `
    CREATE TABLE IF NOT EXISTS WorkoutCalendar (
      cal_id INTEGER PRIMARY KEY AUTOINCREMENT,
      workout_date DATE,
      worksheet_id INTEGER,
      CONSTRAINT fk_worksheet_id
      FOREIGN KEY (worksheet_id) 
      REFERENCES WorkoutSheet(worksheet_id)
    );
  `

  const readOnly = false;
  await db.transactionAsync(async tx => {
    const workoutSheet_result = await tx.executeSqlAsync(workoutSheet);
    console.log('rows affected:', workoutSheet_result.rowsAffected);
    const workoutCalendar_result = await tx.executeSqlAsync(workoutCalendar);
    console.log('rows affected:', workoutCalendar_result.rowsAffected);
  }, readOnly);
}