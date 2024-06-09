import { Stack } from 'expo-router';
import { SQLiteProvider } from 'expo-sqlite';
import { db_name } from './constants';
import { create_tables } from './db/db';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

export default function RootLayout() {
  return (
      <RootLayoutNav />
  );
}


function RootLayoutNav() {
  return (
    <SQLiteProvider databaseName={db_name} onInit={async (db) => {create_tables(db)}}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SQLiteProvider>
  );
}