import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, Animated, Easing } from 'react-native';
import { PokemonTheme } from '../theme/PokemonTheme';

export const LoadingIndicator = () => {
  const [rotateAnim] = useState(new Animated.Value(0));

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const animatePokeball = () => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start();
  };

  useEffect(() => {
    animatePokeball();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../../assets/pokeball.png')}
        style={[styles.loadingIcon, { transform: [{ rotate: rotateInterpolate }] }]}
      />
      <Text style={styles.text}>Carregando...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: PokemonTheme.colors.background,
  },
  loadingIcon: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: PokemonTheme.colors.primary,
  },
});