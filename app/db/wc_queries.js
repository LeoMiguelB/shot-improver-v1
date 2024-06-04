// could use moment js to help perform analysis on workout metrics
import moment from "moment"

const update_fields = (fields) => {
  const arr_fields = Object.keys(fields);
  
  let str = ""
  arr_fields.forEach(item => {
    str += `${item} = '${fields[item].makes}/${fields[item].attempts}',`
  })
  str = str.substring(0, str.length-1)
  return str
}

const set_fields = (fields) => {
  const arr_fields = Object.keys(fields);

  let str = "("
  let values = "("
  arr_fields.forEach(item => {
    str += (item + ",")
    values += `'${fields[item].makes}/${fields[item].attempts}',` 
  })

  // strip the last commad and append a closing bracket
  str = str.substring(0, str.length-1) + ")"
  values = values.substring(0, values.length-1) + ")"

  // select is used here instead of values so that we can conditionally insert values
  return str + "\nVALUES " + values
}

export const insert_workout = async ( db, fields ) => {
  try {
    const readOnly = false;
    await db.transactionAsync(async tx => {
      const workout_exists = await tx.executeSqlAsync(`SELECT worksheet_id FROM WorkoutCalendar WHERE workout_date = date('now')`);
      if (workout_exists.rowsAffected > 0) {
        await tx.executeSqlAsync(`
          UPDATE WorkoutSheet
          SET ${update_fields(fields)}
          WHERE worksheet_id = (SELECT worksheet_id FROM WorkoutCalendar WHERE workout_date = date('now'));
        `)
        console.log(`
        UPDATE WorkoutSheet
        SET ${update_fields(fields)}
        WHERE worksheet_id = (SELECT worksheet_id FROM WorkoutCalendar WHERE workout_date = date('now'));
        `)
      }
      else {
        await tx.executeSqlAsync(`
          INSERT INTO WorkoutSheet
          ${set_fields(fields)};
        `)
        console.log(`
        INSERT INTO WorkoutSheet
        ${set_fields(fields)};
        `)

        const result = await tx.executeSqlAsync(`SELECT MAX(worksheet_id) FROM WorkoutSheet`)
        
        const worksheet_id = result.rows[0]["MAX(worksheet_id)"]
        
        console.log(worksheet_id)
        
        await tx.executeSqlAsync(`
        INSERT INTO WorkoutCalendar
          (workout_date, worksheet_id)
          VALUES
          (date('now'), ${worksheet_id})
          `)
        }

        // tests
        const result = await tx.executeSqlAsync(`SELECT * FROM WorkoutSheet`)
        console.log("added rows ", result.rows)
    }, readOnly);
    
  } catch (error) {
    console.error(error)
    throw Error("Failed to add workout")
  }
}


export const get_workout = async ( db, date ) => {

  let workout = null

  try {
    await db.transactionAsync(async tx => {
      workout = await tx.executeSqlAsync(`
        SELECT * FROM WorkoutCalendar INNER JOIN WorkoutSheet 
        ON WorkoutSheet.worksheet_id = WorkoutCalendar.worksheet_id
        WHERE workout_date = '${date}';
      `)
      console.log(workout)

      dbg = await tx.executeSqlAsync(`
        SELECT * FROM WorkoutCalendar;
      `)
      console.log(dbg)

    }, readOnly = false)
  } catch (e) {
    console.log("caught exception: ", e)
  }

  return workout;
}