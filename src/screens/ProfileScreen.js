// src/screens/ProfileScreen.js
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, ActivityIndicator, Platform, StatusBar,
  Animated, Easing // Importar Animated e Easing
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth } from '../../firebaseConfig';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { PokemonTheme } from '../theme/PokemonTheme';

const ProfileScreen = ({ navigation }) => {
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [isLoading, setIsLoading] = useState(true);
  const [rotateAnim] = useState(new Animated.Value(0)); // Estado para a animação

  // Animação da Pokéball
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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (isLoading) {
        setIsLoading(false);
      }
    });
    if (auth.currentUser && isLoading) {
        setIsLoading(false);
    }
    animatePokeball(); // Inicia a animação ao montar o componente
    return () => unsubscribe();
  }, [isLoading]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Logout bem-sucedido na ProfileScreen.");
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (isLoading) {
    return (
      <LinearGradient colors={[PokemonTheme.colors.background, PokemonTheme.colors.border]} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PokemonTheme.colors.accent} />
        <Text style={styles.loadingText}>Carregando perfil...</Text>
      </LinearGradient>
    );
  }

  if (!currentUser) {
    return (
      <LinearGradient colors={[PokemonTheme.colors.background, PokemonTheme.colors.border]} style={styles.loadingContainer}>
        <Icon name="lock-outline" size={50} color={PokemonTheme.colors.secondaryText} />
        <Text style={styles.messageText}>Redirecionando para o login...</Text>
      </LinearGradient>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={[PokemonTheme.colors.background, PokemonTheme.colors.border]} style={styles.gradientBackground}>
        <StatusBar barStyle="dark-content" backgroundColor={PokemonTheme.colors.background} />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Header do perfil com gradiente e pokeball */}
          <LinearGradient
            colors={[PokemonTheme.colors.headerGradientStart, PokemonTheme.colors.headerGradientEnd]}
            style={styles.profileHeader}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Animated.Image // Usando Animated.Image diretamente
              source={require('../../assets/pokeball.png')}
              style={[styles.profilePokeballIcon, { transform: [{ rotate: rotateInterpolate }] }]}
            />
            <Icon name="account-circle" size={100} color={PokemonTheme.colors.accent} />
            <Text style={styles.userName}>{currentUser.displayName || currentUser.email || 'Usuário Anônimo'}</Text>
            {currentUser.email && <Text style={styles.userEmail}>{currentUser.email}</Text>}
          </LinearGradient>

          <View style={styles.infoSection}>
            <InfoRow icon="email-outline" label="Email" value={currentUser.email || 'Não fornecido'} />
            <InfoRow icon="shield-account-outline" label="UID" value={currentUser.uid} selectable />
            <InfoRow icon="clock-time-four-outline" label="Membro desde" value={new Date(currentUser.metadata.creationTime).toLocaleDateString()} />
            <InfoRow icon="cellphone-iphone" label="Último login" value={new Date(currentUser.metadata.lastSignInTime).toLocaleString()} />
            <InfoRow icon={currentUser.isAnonymous ? "incognito" : "account-check-outline"} label="Tipo de Conta" value={currentUser.isAnonymous ? "Anônima (Convidado)" : "Registrada"} />
          </View>

          <TouchableOpacity
            onPress={handleLogout}
            style={styles.logoutButton}
          >
            <Icon name="logout-variant" size={22} color={PokemonTheme.colors.card} style={{marginRight: 10}} /><Text style={styles.logoutButtonText}>Sair da Conta</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const InfoRow = ({ icon, label, value, selectable }) => (
  <View style={styles.infoRow}>
    <Icon name={icon} size={24} color={PokemonTheme.colors.primary} style={styles.infoIcon} />
    <View style={styles.infoTextContainer}>
      <Text style={styles.infoLabel}>{label}:</Text>
      <Text style={styles.infoValue} selectable={selectable}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PokemonTheme.colors.background,
  },
  gradientBackground: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: PokemonTheme.colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: PokemonTheme.colors.primary,
  },
  messageText: {
    color: PokemonTheme.colors.text,
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 40,
    paddingBottom: 20,
    marginBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    ...PokemonTheme.shadows.header,
  },
  profilePokeballIcon: {
    width: 60,
    height: 60,
    position: 'absolute',
    top: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 30,
    right: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: PokemonTheme.colors.card,
    marginTop: 15,
  },
  userEmail: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 5,
  },
  infoSection: {
    marginHorizontal: 20,
    backgroundColor: PokemonTheme.colors.card,
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
    ...PokemonTheme.shadows.card,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  infoIcon: {
    marginRight: 15,
    marginTop: 2,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: PokemonTheme.colors.secondaryText,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: PokemonTheme.colors.text,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: PokemonTheme.colors.notification,
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    ...PokemonTheme.shadows.button,
  },
  logoutButtonText: {
    color: PokemonTheme.colors.card,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
