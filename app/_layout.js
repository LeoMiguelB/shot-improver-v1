import { Stack } from 'expo-router';
import { useCallback, useEffect } from 'react';
import { openDatabase, create_tables } from './db/db';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

export default function RootLayout() {


  return <RootLayoutNav />;
}


function RootLayoutNav() {

  const loadTables = useCallback(async () => { // load tables in database
    try {
      const db = await openDatabase()
      await create_tables(db)
    } catch (error) {
      console.error(error)
    }
  }, [])

  useEffect(() => {
    loadTables()
  },[loadTables])

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}