import { DataViewerTable } from "../components/DataViewerTable";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { get_workout } from "./db/wc_queries";
import { useSQLiteContext } from "expo-sqlite";

export default function Page() {

  const db = useSQLiteContext()

  const { date } = useLocalSearchParams()

  const [shotData, setShotData] = useState(null)

  const handleGetData = async () => {
    console.log("inside dynamic route [date] current date is:", date)
    const workout_sheet = await get_workout(db, date)
    setShotData(workout_sheet)
  }

  useEffect(() => {
    handleGetData()
  },[])

  return (
    <>
      {
        Boolean(shotData) && <DataViewerTable shotData={shotData} />
      }
    </>
  )
}