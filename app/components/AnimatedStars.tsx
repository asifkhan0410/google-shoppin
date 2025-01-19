import React, { useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

export const AnimatedStars = () => {
  const animations = [...Array(20)].map(() => new Animated.Value(0));

  useEffect(() => {
    const animate = () => {
      const animationSequence = animations.map((anim, i) => {
        return Animated.sequence([
          Animated.delay(i * 100),
          Animated.timing(anim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]);
      });

      Animated.loop(
        Animated.stagger(100, animationSequence)
      ).start();
    };

    animate();
  }, []);

  return (
    <View style={styles.starsContainer}>
      {animations.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.star,
            {
              transform: [
                {
                  scale: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.5, 1],
                  }),
                },
              ],
              opacity: anim,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  starsContainer: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  star: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#ffffff',
  },
});