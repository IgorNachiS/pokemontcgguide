import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../hooks/useAuth';
import { auth } from '../../firebaseConfig';
import { PokemonTheme } from '../theme/PokemonTheme';

const CustomDrawer = ({ navigation }) => {
  const { user } = useAuth();
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

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.navigate('Login');
    } catch (error) {
      console.error(error);
    }
  };

  const drawerItems = [
    { icon: 'home', label: 'Início', route: 'Dashboard' },
    { icon: 'card-search', label: 'Busca Avançada', route: 'AdvancedSearch' },
    { icon: 'format-list-checks', label: 'Lista de Compras', route: 'ShoppingList' },
    { icon: 'account', label: 'Perfil', route: 'Profile' },
  ];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[PokemonTheme.colors.headerGradientStart, PokemonTheme.colors.headerGradientEnd]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Animated.Image
          source={require('../../assets/pokeball.png')}
          style={[styles.pokeballIcon, { transform: [{ rotate: rotateInterpolate }] }]}
        />
        <Text style={styles.title}>PokéCollection</Text>
        <Text style={styles.subtitle}>Guia do Colecionador</Text>

        {user && (
          <View style={styles.userInfo}>
            <Icon name="account" size={24} color={PokemonTheme.colors.card} />
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        )}
      </LinearGradient>

      <View style={styles.menuItems}>
        {drawerItems.map((item) => (
          <TouchableOpacity
            key={item.route}
            style={styles.drawerItem}
            onPress={() => navigation.navigate(item.route)}
          >
            <Icon name={item.icon} size={24} color={PokemonTheme.colors.primary} />
            <Text style={styles.drawerText}>{item.label}</Text>
            <Icon name="chevron-right" size={20} color={PokemonTheme.colors.primary} />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.drawerItem, styles.logoutButton]}
        onPress={handleLogout}
      >
        <Icon name="logout" size={24} color={PokemonTheme.colors.notification} />
        <Text style={[styles.drawerText, { color: PokemonTheme.colors.notification }]}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PokemonTheme.colors.card,
  },
  header: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 30,
    ...PokemonTheme.shadows.header,
    alignItems: 'center',
  },
  pokeballIcon: {
    width: 50,
    height: 50,
    marginBottom: 10,
  },
  title: {
    ...PokemonTheme.textVariants.header,
    fontSize: 24,
    color: PokemonTheme.colors.card,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 5,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  userEmail: {
    color: PokemonTheme.colors.card,
    marginLeft: 10,
    ...PokemonTheme.textVariants.body,
  },
  menuItems: {
    flex: 1,
    padding: 20,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: PokemonTheme.colors.border,
  },
  drawerText: {
    ...PokemonTheme.textVariants.body,
    marginLeft: 15,
    flex: 1,
    color: PokemonTheme.colors.text,
  },
  logoutButton: {
    marginTop: 'auto',
    marginBottom: 30,
    paddingHorizontal: 20,
    borderBottomWidth: 0,
    backgroundColor: PokemonTheme.colors.card,
    borderRadius: 10,
    ...PokemonTheme.shadows.button,
  },
});

export default CustomDrawer;