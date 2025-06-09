import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, Image, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar, Platform,
  Dimensions, Animated, Easing
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useCards } from '../hooks/useCards';
import { auth } from '../../firebaseConfig';
import { signOut } from 'firebase/auth';
import { PokemonTheme } from '../theme/PokemonTheme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width / 2 - 24;

const DashboardScreen = ({ navigation }) => {
  const { cards, loading, error, refetch } = useCards();
  const [refreshing, setRefreshing] = useState(false);
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

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const renderCard = ({ item }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => navigation.navigate('CardDetail', { card: item })}
    >
      <LinearGradient
        colors={[PokemonTheme.colors.cardGradientStart, PokemonTheme.colors.cardGradientEnd]}
        style={styles.cardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Image
          source={{ uri: item.images?.small || 'https://placehold.co/150x210/2A75BB/FFCB05?text=Pok%C3%A9mon' }}
          style={styles.cardImage}
          resizeMode="contain"
        />
        <View style={styles.cardDetails}>
          <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.cardSet}>{item.set?.name}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={[PokemonTheme.colors.background, PokemonTheme.colors.border]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={PokemonTheme.colors.background} />

        <LinearGradient
          colors={[PokemonTheme.colors.headerGradientStart, PokemonTheme.colors.headerGradientEnd]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <View style={styles.headerContent}>
            <Animated.Image
              source={require('../../assets/pokeball.png')}
              style={[styles.pokeballIcon, { transform: [{ rotate: rotateInterpolate }] }]}
            />
            <Text style={styles.title}>PokéCollection</Text>
          </View>
          <TouchableOpacity onPress={() => signOut(auth)} style={styles.logoutButton}>
            <Icon name="logout" size={28} color={PokemonTheme.colors.card} />
          </TouchableOpacity>
        </LinearGradient>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Animated.Image
              source={require('../../assets/pokeball.png')}
              style={[styles.loadingIcon, { transform: [{ rotate: rotateInterpolate }] }]}
            />
            <Text style={styles.loadingText}>Carregando cartas...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Icon name="alert-circle" size={50} color={PokemonTheme.colors.notification} />
            <Text style={styles.errorText}>Erro ao carregar cartas</Text>
          </View>
        ) : (
          <FlatList
            data={cards}
            renderItem={renderCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.listContent}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            ListEmptyComponent={
              <View style={styles.emptyListContainer}>
                <Icon name="cards-outline" size={80} color={PokemonTheme.colors.placeholderText} />
                <Text style={styles.emptyListText}>Nenhuma carta encontrada.</Text>
                <Text style={styles.emptyListSubText}>Tente buscar algo na busca avançada!</Text>
              </View>
            }
          />
        )}
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 16 : 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    ...PokemonTheme.shadows.header,
    marginBottom: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pokeballIcon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  title: {
    ...PokemonTheme.textVariants.header,
  },
  logoutButton: {
    padding: 5,
  },
  cardContainer: {
    width: CARD_WIDTH,
    margin: 8,
    borderRadius: 12,
    overflow: 'hidden',
    ...PokemonTheme.shadows.card,
  },
  cardGradient: {
    padding: 12,
    alignItems: 'center',
  },
  cardImage: {
    width: '100%',
    height: CARD_WIDTH * 1.4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: PokemonTheme.colors.border,
  },
  cardDetails: {
    marginTop: 8,
    width: '100%',
  },
  cardName: {
    ...PokemonTheme.textVariants.cardTitle,
    textAlign: 'center',
  },
  cardSet: {
    ...PokemonTheme.textVariants.cardSubtitle,
    marginTop: 4,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingIcon: {
    width: 100,
    height: 100,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: PokemonTheme.colors.primary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: PokemonTheme.colors.notification,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginTop: 50,
  },
  emptyListText: {
    fontSize: 18,
    fontWeight: '600',
    color: PokemonTheme.colors.secondaryText,
    marginTop: 15,
    textAlign: 'center',
  },
  emptyListSubText: {
    fontSize: 14,
    color: PokemonTheme.colors.placeholderText,
    marginTop: 8,
    textAlign: 'center',
  },
});

export default DashboardScreen;