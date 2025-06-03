// src/screens/CardDetailScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, Image, ScrollView, StyleSheet, TouchableOpacity,
    Alert, Platform, StatusBar, ActivityIndicator, SafeAreaView,
    Animated, Easing
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from '../../firebaseConfig';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { PokemonTheme } from '../theme/PokemonTheme';

const CardDetailScreen = ({ navigation }) => {
  const route = useRoute();
  const { card } = route.params;
  const [isAddingToList, setIsAddingToList] = useState(false);
  const [rotateAnim] = useState(new Animated.Value(0));

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const animatePokeball = useCallback(() => {
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start();
  }, [rotateAnim]);

  useEffect(() => {
    animatePokeball();
  }, [animatePokeball]);

  const handleAddToShoppingList = async (cardToAdd) => {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      Alert.alert(
        "Acesso Negado",
        "Você precisa estar logado para adicionar itens à lista de compras.",
        [
          { text: "OK" },
          { text: "Fazer Login", onPress: () => navigation.navigate('Login') }
        ]
      );
      return;
    }

    if (!cardToAdd || !cardToAdd.id) {
        Alert.alert("Erro", "Informação do card inválida.");
        return;
    }
    setIsAddingToList(true);
    try {
      const shoppingListCollectionRef = collection(db, 'users', userId, 'shoppingList');

      const q = query(shoppingListCollectionRef, where("cardApiId", "==", cardToAdd.id));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        Alert.alert("Item Existente", `${cardToAdd.name} já está na sua lista de compras.`);
        setIsAddingToList(false);
        return;
      }

      await addDoc(shoppingListCollectionRef, {
        cardApiId: cardToAdd.id,
        name: cardToAdd.name,
        imageUrl: cardToAdd.images?.small || null,
        set: {
            id: cardToAdd.set?.id || null,
            name: cardToAdd.set?.name || 'N/A',
            series: cardToAdd.set?.series || 'N/A',
        } ,
        rarity: cardToAdd.rarity || null,
        tcgplayerPrices: cardToAdd.tcgplayer?.prices || null,
        addedAt: new Date(),
        purchased: false,
      });
      Alert.alert("Sucesso!", `${cardToAdd.name} foi adicionado à sua lista de compras.`);
    } catch (error) {
      console.error("Erro ao adicionar item à lista de compras: ", error);
      Alert.alert("Erro", "Não foi possível adicionar o item à lista. Tente novamente.");
    } finally {
      setIsAddingToList(false);
    }
  };

  if (!card) {
    return (
      <LinearGradient colors={[PokemonTheme.colors.background, PokemonTheme.colors.border]} style={styles.errorContainer}>
        <Icon name="alert-circle-outline" size={50} color={PokemonTheme.colors.notification} />
        <Text style={styles.errorText}>Nenhuma carta encontrada ou dados inválidos.</Text>
      </LinearGradient>
    );
  }

  const renderPriceRow = (label, priceData) => {
    if (!priceData) return null;
    const hasPriceInfo = typeof priceData === 'object' && (priceData.low != null || priceData.mid != null || priceData.high != null || priceData.market != null);
    if (!hasPriceInfo) return null;

    return (
      <View style={styles.priceDetailRow}>
        <Text style={styles.priceLabel}>{label}:</Text>
        <View>
            {priceData.low != null && <Text style={styles.priceValue}>Baixo: ${priceData.low.toFixed(2)}</Text>}
            {priceData.mid != null && <Text style={styles.priceValue}>Médio: ${priceData.mid.toFixed(2)}</Text>}
            {priceData.high != null && <Text style={styles.priceValue}>Alto: ${priceData.high.toFixed(2)}</Text>}
            {priceData.market != null && <Text style={styles.priceValueMarket}>Mercado: ${priceData.market.toFixed(2)}</Text>}
        </View>
      </View>
    );
  };

  const tcgPlayerPrices = card.tcgplayer?.prices || {};

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={[PokemonTheme.colors.background, PokemonTheme.colors.border]} style={styles.gradientBackground}>
        <StatusBar barStyle="dark-content" backgroundColor={PokemonTheme.colors.background}/>
        
        <LinearGradient
          colors={[PokemonTheme.colors.headerGradientStart, PokemonTheme.colors.headerGradientEnd]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <TouchableOpacity style={styles.backButtonHeader} onPress={() => navigation.goBack()}>
              <Icon name="arrow-left-circle" size={34} color={PokemonTheme.colors.card} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Animated.Image
              source={require('../../assets/pokeball.png')}
              style={[styles.pokeballIcon, { transform: [{ rotate: rotateInterpolate }] }]}
            />
            <Text style={styles.headerTitle}>Detalhes da Carta</Text>
          </View>
        </LinearGradient>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: card.images?.large || card.images?.small || 'https://placehold.co/300x420/2c3e50/ffffff?text=Pok%C3%A9mon' }}
              style={styles.cardImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.detailsContainer}>
            <Text style={styles.cardName}>{card.name}</Text>
            <View style={styles.setInfoContainer}>
                <Icon name="cards-playing-outline" size={20} color={PokemonTheme.colors.primary} style={{marginRight: 5}}/>
                <Text style={styles.cardSet}>{card.set?.name || 'Set Desconhecido'} ({card.set?.id || 'N/A'})</Text>
            </View>
            {card.rarity && (
                <View style={styles.rarityContainer}>
                    <Icon name="star-four-points-outline" size={20} color={PokemonTheme.colors.primary} style={{marginRight: 5}}/>
                    <Text style={styles.cardRarity}>Raridade: {card.rarity}</Text>
                </View>
            )}

            <TouchableOpacity
                style={styles.addToCartButton}
                onPress={() => handleAddToShoppingList(card)}
                disabled={isAddingToList}
            >
              {isAddingToList ? (
                <ActivityIndicator color={PokemonTheme.colors.primary} size="small"/>
              ) : (
                <>
                  <Icon name="cart-plus" size={22} color={PokemonTheme.colors.primary} style={{marginRight: 10}}/>
                  <Text style={styles.addToCartButtonText}>Adicionar à Lista</Text>
                </>
              )}
            </TouchableOpacity>

            {Object.keys(tcgPlayerPrices).length > 0 ? (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}><Icon name="cash-multiple" size={24} color={PokemonTheme.colors.primary}/> <Text>Preços TCGPlayer</Text></Text>
                <View style={styles.priceBox}>
                    {renderPriceRow('Normal', tcgPlayerPrices.normal)}
                    {renderPriceRow('Unlimited Holofoil', tcgPlayerPrices.unlimitedHolofoil)}
                    {renderPriceRow('1st Edition Holofoil', tcgPlayerPrices.firstEditionHolofoil)}
                    {renderPriceRow('Reverse Holofoil', tcgPlayerPrices.reverseHolofoil)}

                    {Object.keys(tcgPlayerPrices).map(priceTypeKey => {
                        const commonKeys = ['normal', 'unlimitedHolofoil', 'firstEditionHolofoil', 'reverseHolofoil'];
                        if (commonKeys.includes(priceTypeKey) || !tcgPlayerPrices[priceTypeKey]) return null;

                        const label = priceTypeKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                        const priceRowElement = renderPriceRow(label, tcgPlayerPrices[priceTypeKey]);
                        return priceRowElement ? <React.Fragment key={priceTypeKey}>{priceRowElement}</React.Fragment> : null;
                    })}
                </View>
              </View>
            ) : (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}><Icon name="cash-multiple" size={24} color={PokemonTheme.colors.primary}/> <Text>Preços TCGPlayer</Text></Text>
                <Text style={styles.noPriceText}>Nenhuma informação de preço disponível.</Text>
              </View>
            )}

            {card.types && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}><Icon name="fire" size={24} color={PokemonTheme.colors.primary}/> <Text>Tipos</Text></Text>
                <View style={styles.tagContainer}>
                  {card.types.map(type => <Text key={type} style={styles.tag}>{type}</Text>)}
                </View>
              </View>
            )}

            {card.attacks && card.attacks.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}><Icon name="sword-cross" size={24} color={PokemonTheme.colors.primary}/> <Text>Ataques</Text></Text>
                {card.attacks.map((attack, index) => (
                  <View key={`${attack.name}-${index}`} style={styles.attackContainer}>
                    <Text style={styles.attackName}>{attack.name}</Text>
                    <Text style={styles.attackDetail}>Custo: {attack.cost?.join(' ') || 'N/A'}</Text>
                    <Text style={styles.attackDetail}>Dano: {attack.damage || 'N/A'}</Text>
                    {attack.text && <Text style={styles.attackDescription}>{attack.text}</Text>}
                  </View>
                ))}
              </View>
            )}

            {card.weaknesses && card.weaknesses.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}><Icon name="shield-alert-outline" size={24} color={PokemonTheme.colors.primary}/> <Text>Fraquezas</Text></Text>
                 <View style={styles.tagContainer}>
                    {card.weaknesses.map((weakness) => (
                        <Text key={weakness.type} style={[styles.tag, styles.weaknessTag]}>{weakness.type} ({weakness.value})</Text>
                    ))}
                </View>
              </View>
            )}

             {card.resistances && card.resistances.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}><Icon name="shield-check-outline" size={24} color={PokemonTheme.colors.primary}/> <Text>Resistências</Text></Text>
                 <View style={styles.tagContainer}>
                    {card.resistances.map((resistance) => (
                        <Text key={resistance.type} style={[styles.tag, styles.resistanceTag]}>{resistance.type} ({resistance.value})</Text>
                    ))}
                </View>
              </View>
            )}

            {card.flavorText && (
                 <View style={styles.section}>
                    <Text style={styles.sectionTitle}><Icon name="information-outline" size={24} color={PokemonTheme.colors.primary}/> <Text>Flavor Text</Text></Text>
                    <Text style={styles.flavorText}>{card.flavorText}</Text>
                </View>
            )}
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PokemonTheme.colors.background,
  },
  gradientBackground: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 16 : 40,
    paddingBottom: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    ...PokemonTheme.shadows.header,
    marginBottom: 10,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    marginRight: 34,
  },
  pokeballIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  headerTitle: {
    ...PokemonTheme.textVariants.header,
    fontSize: 22,
    color: PokemonTheme.colors.card,
  },
  backButtonHeader: {
    position: 'absolute',
    top: Platform.OS === 'android' ? StatusBar.currentHeight + 15 : 50,
    left: 15,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 5,
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
    paddingTop: 0,
  },
  cardImage: {
    width: '80%',
    aspectRatio: 0.71,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: PokemonTheme.colors.accent,
    backgroundColor: PokemonTheme.colors.background,
    ...PokemonTheme.shadows.card,
  },
  detailsContainer: {
    paddingHorizontal: 20,
  },
  cardName: {
    ...PokemonTheme.textVariants.modalTitle,
    color: PokemonTheme.colors.primary,
    marginBottom: 8,
  },
  setInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
  },
  cardSet: {
    ...PokemonTheme.textVariants.body,
    color: PokemonTheme.colors.text,
    textAlign: 'center',
  },
  rarityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  cardRarity: {
    ...PokemonTheme.textVariants.body,
    color: PokemonTheme.colors.text,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  addToCartButton: {
    flexDirection: 'row',
    backgroundColor: PokemonTheme.colors.accent,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
    minHeight: 50,
    ...PokemonTheme.shadows.button,
  },
  addToCartButtonText: {
    ...PokemonTheme.textVariants.buttonText,
    color: PokemonTheme.colors.primary,
  },
  section: {
    marginBottom: 25,
    backgroundColor: PokemonTheme.colors.card,
    borderRadius: 12,
    padding: 15,
    ...PokemonTheme.shadows.card,
  },
  sectionTitle: {
    ...PokemonTheme.textVariants.sectionTitle,
    color: PokemonTheme.colors.text,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceBox: {
    backgroundColor: PokemonTheme.colors.inputBackground,
    borderRadius: 8,
    padding: 10,
  },
  priceDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: PokemonTheme.colors.border,
  },
  priceLabel: {
    ...PokemonTheme.textVariants.small,
    color: PokemonTheme.colors.secondaryText,
    fontWeight: '600',
  },
  priceValue: {
    ...PokemonTheme.textVariants.body,
    color: PokemonTheme.colors.text,
    textAlign: 'right',
  },
  priceValueMarket: {
    ...PokemonTheme.textVariants.body,
    color: PokemonTheme.colors.success,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  noPriceText: {
    ...PokemonTheme.textVariants.body,
    color: PokemonTheme.colors.placeholderText,
    fontStyle: 'italic',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: 'rgba(255,203,5,0.3)',
    color: PokemonTheme.colors.text,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
    fontSize: 14,
  },
  weaknessTag: {
    backgroundColor: 'rgba(255, 107, 107, 0.3)',
  },
  resistanceTag: {
     backgroundColor: 'rgba(76, 175, 80, 0.3)',
  },
  attackContainer: {
    backgroundColor: PokemonTheme.colors.inputBackground,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  attackName: {
    ...PokemonTheme.textVariants.cardTitle,
    color: PokemonTheme.colors.primary,
    marginBottom: 4,
  },
  attackDetail: {
    ...PokemonTheme.textVariants.body,
    color: PokemonTheme.colors.text,
    marginBottom: 2,
  },
  attackDescription: {
    ...PokemonTheme.textVariants.small,
    color: PokemonTheme.colors.secondaryText,
    fontStyle: 'italic',
    marginTop: 4,
  },
  flavorText: {
    ...PokemonTheme.textVariants.body,
    color: PokemonTheme.colors.text,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: PokemonTheme.colors.background,
  },
  errorText: {
    color: PokemonTheme.colors.text,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
  }
});

export default CardDetailScreen;
