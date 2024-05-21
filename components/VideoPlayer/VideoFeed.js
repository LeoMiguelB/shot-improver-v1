/*
the following blog post was used as a reference https://dev.to/albertocabrerajr/implement-tiktok-like-feed-using-react-native-expo-1le2
*/


import { View, FlatList, StyleSheet } from 'react-native';
import React, { useRef, useState } from 'react';
import VideoRes from './VideoRes';

const test_video = require("../../assets/test-video.mp4")

const videos = [
  test_video
];

export default function VideoFeed() {
  const [currentViewableItemIndex, setCurrentViewableItemIndex] = useState(0);
  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 }
  const onViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentViewableItemIndex(viewableItems[0].index ?? 0);
    }
  }
  const viewabilityConfigCallbackPairs = useRef([{ viewabilityConfig, onViewableItemsChanged }])
  return (
    <View style={styles.container}>
      <FlatList
        data={videos}
        renderItem={({ item, index }) => (
          <VideoRes item={item} shouldPlay={index === currentViewableItemIndex} />
        )}
        keyExtractor={item => item}
        pagingEnabled
        horizontal={false}
        showsVerticalScrollIndicator={false}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      />
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});