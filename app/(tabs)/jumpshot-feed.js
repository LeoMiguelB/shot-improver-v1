/*
currently backlogged -- not important feature
*/

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import VideoFeed from '../../components/VideoPlayer/VideoFeed';

export default function Page() {

  return (
    <View style={styles.container}> 
      <VideoFeed />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
