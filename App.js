// App.js
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { PokemonTheme } from './src/theme/PokemonTheme';

import LoginScreen from './src/screens/LoginScreen';
import { DrawerNavigator } from './src/navigation/DrawerNavigator';
import CardDetailScreen from './src/screens/CardDetailScreen';
import { AuthProvider } from './src/hooks/useAuth';

const Stack = createStackNavigator();

const App = () => {
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoadingAuth(false);
    });

    return unsubscribe;
  }, []);

  if (isLoadingAuth) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PokemonTheme.colors.accent} />
        <Text style={styles.loadingText}>Carregando Treinador...</Text>
      </View>
    );
  }

  return (
    <AuthProvider>
      <PaperProvider theme={PokemonTheme}>
        <StatusBar style="light" backgroundColor={PokemonTheme.colors.primary} />
        <NavigationContainer theme={PokemonTheme}>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            }}
          >
            {user ? (
              <>
                <Stack.Screen name="MainDrawer" component={DrawerNavigator} />
                <Stack.Screen name="CardDetail" component={CardDetailScreen} />
              </>
            ) : (
              <Stack.Screen name="Login" component={LoginScreen} />
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: PokemonTheme.colors.primary,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: PokemonTheme.colors.accent,
    fontWeight: 'bold',
  },
});

export default App;