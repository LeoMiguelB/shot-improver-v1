import { View, StyleSheet, Pressable, Dimensions, Text } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import React, { useEffect, useState } from 'react';

export default function VideoRes({ item, shouldPlay }) {
  const video = React.useRef(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!video.current) return;

    if (shouldPlay) { // should play true iff valid screen coverage
      video.current.playAsync()
    } else {
      video.current.pauseAsync()
      video.current.setPositionAsync(0)
    }
  }, [shouldPlay])

  return (
    <Pressable onPress={() => status.isPlaying ? video.current?.pauseAsync() : video.current?.playAsync()}>
      <View style={styles.videoContainer}>
        <Video 
          ref={video}
          source={item}
          style={styles.video}
          isMuted={true}
          isLooping
          resizeMode={ResizeMode.COVER}
          useNativeControls={false}
          onPlaybackStatusUpdate={status => setStatus(() => status)}
        />
        <View style={styles.testText}>
          <Text>Hello World</Text>
        </View>
      </View>
    </Pressable>
  );
}


const styles = StyleSheet.create({
  videoContainer: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  testText: {
    position: "absolute",
    top: 40,
    left: Dimensions.get('window').width-15

  }
});