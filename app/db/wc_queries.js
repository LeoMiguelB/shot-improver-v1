export const insert_workout = async (db, fields) => {
  console.log(new Date())

  console.log("inside insert_workout ", db)

  await db.withExclusiveTransactionAsync(async tx => {

    const workout_exists = await tx.getAllAsync(`SELECT worksheet_id FROM WorkoutCalendar WHERE workout_date = date('now')`);

    if (workout_exists.length > 0) {

      worksheet_id = workout_exists[0]["worksheet_id"]

      console.log("workout does exist hence we are updating")

      console.log("updating worksheet with id: ", worksheet_id)


      /*
      !NOTE: reason runAsync is not used here is we don't want this map function to be async w.r.t insert_workout or else it may finish too late before the connection is closed
      */
      Object.entries(fields).map(([key, value]) => {
        try {
          // key is set and stone in constants and does not come from user input -- no possible injection here
          tx.runSync(`UPDATE WorkoutSheet SET ${key} = $value WHERE worksheet_id = $ws_id`, { $value: `${value.makes}/${value.attempts}`, $ws_id: worksheet_id })

          console.log(`updated ${key}`)

        } catch (e) {
          console.log("caught exception ", e)
        }
      })

    }
    else {

      console.log("workout DOES NOT exist hence we are INSERTING")

      console.log(Object.entries(fields).map(([key, value]) => `${value.makes}/${value.attempts}`))
      try {
        await tx.runAsync(`
              INSERT INTO WorkoutSheet 
              (three_sec_area, left_block, right_block, left_elbow, right_elbow, top_of_circle, left_wing, right_wing, left_corner, right_corner, left_short_corner, right_short_corner, free_throw_line)
              VALUES 
              (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, Object.entries(fields).map(([key, value]) => `${value.makes}/${value.attempts}`))
  
        const result = await tx.getFirstAsync(`SELECT MAX(worksheet_id) FROM WorkoutSheet`)
  
        const worksheet_id = result["MAX(worksheet_id)"]
  
        console.log("worksheet id that was inserted ", worksheet_id)
  
        await tx.runAsync(`
            INSERT INTO WorkoutCalendar
              (workout_date, worksheet_id)
              VALUES
              (date('now'), ?)
              `, [worksheet_id])

              } catch (e) {

        console.log("caught an exception ", e)
      }
    }
  })

  const debug_table = await db.getAllAsync(`SELECT * FROM WorkoutCalendar`)
  console.log("tables currently in WorkoutCalendar are:", debug_table)

}


export const get_workout = async (db, date) => {


  let workout = null

  console.log("inside get_workout ", date)

  try {
    await db.withExclusiveTransactionAsync(async tx => {
      workout = await tx.getFirstAsync(`
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
        WHERE WorkoutCalendar.workout_date = ?;
      `, [date])

      console.log(workout)

    }, readOnly = false)
  } catch (e) {
    console.log("caught exception: ", e)
  }

  return workout;
}