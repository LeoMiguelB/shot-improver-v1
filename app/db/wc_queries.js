const update_fields = (fields) => {
  return Object.entries(fields)
    .map(([key, value]) => `${key} = '${value.makes}/${value.attempts}'`)
    .join(',');
}

const set_fields = (fields) => {
  const keys = Object.keys(fields);

  const columns = keys.map(key => key).join(',');
  const values = keys.map(key => `'${fields[key].makes}/${fields[key].attempts}'`).join(',');

  return `(${columns})\nVALUES (${values})`;
};


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

  console.log("inside get_workout ", date)

  try {
    await db.transactionAsync(async tx => {
      workout = await tx.executeSqlAsync(`
        SELECT 
        free_throw_line, 
        left_block, 
        left_corner, 
        left_elbow, 
        left_short_corner, 
        left_wing, 
        right_block, 
        right_corner, 
        right_elbow, 
        right_short_corner, 
        right_wing, 
        three_sec_area, 
        top_of_circle 
        FROM WorkoutCalendar INNER JOIN WorkoutSheet 
        ON WorkoutSheet.worksheet_id = WorkoutCalendar.worksheet_id
        WHERE WorkoutCalendar.workout_date = '${date}';
      `)
      
      console.log(workout.rows[0])

    }, readOnly = false)
  } catch (e) {
    console.log("caught exception: ", e)
  }

  return workout.rows[0];
}