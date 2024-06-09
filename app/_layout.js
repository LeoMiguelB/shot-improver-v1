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
  /*
  https://docs.expo.dev/router/advanced/root-layout/#:~:text=often%20used%20to%20inject%20global%20providers%20such%20as%20Redux%2C%20Themes%2C%20Styles%2C%20and%20so%20on%2C%20into%20the%20app%2C%20and%20to%20delay%20rendering%20until%20assets%20and%20fonts%20are%20loaded.

  root layout is the best place to inject providers
  */
  return (
    <>
      <SQLiteProvider databaseName={db_name} onInit={async (db) => {create_tables(db)}}>
        <RootLayoutNav />
     </SQLiteProvider>
    </>
  );
}


function RootLayoutNav() {
  return (
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
  );
}