import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { PokemonTheme } from './src/theme/PokemonTheme';

import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import CardDetailScreen from './src/screens/CardDetailScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AdvancedSearchScreen from './src/screens/AdvancedSearchScreen';
import ShoppingListScreen from './src/screens/ShoppingListScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainAppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let iconColor = focused ? PokemonTheme.colors.accent : PokemonTheme.colors.primary;
          size = focused ? 28 : 24;

          switch (route.name) {
            case 'Início':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Busca':
              iconName = focused ? 'card-search' : 'card-search-outline';
              break;
            case 'Lista':
              iconName = focused ? 'format-list-checks' : 'format-list-text';
              break;
            case 'Perfil':
              iconName = focused ? 'account' : 'account-outline';
              break;
          }

          return <Icon name={iconName} size={size} color={iconColor} />;
        },
        tabBarActiveTintColor: PokemonTheme.colors.accent,
        tabBarInactiveTintColor: PokemonTheme.colors.primary,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
        },
      })}
    >
      <Tab.Screen name="Início" component={DashboardScreen} />
      <Tab.Screen name="Busca" component={AdvancedSearchScreen} />
      <Tab.Screen name="Lista" component={ShoppingListScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

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
              <Stack.Screen name="MainApp" component={MainAppTabs} />
              <Stack.Screen name="CardDetail" component={CardDetailScreen} />
            </>
          ) : (
            <Stack.Screen name="Login" component={LoginScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
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