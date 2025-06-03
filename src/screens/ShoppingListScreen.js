// src/screens/ShoppingListScreen.js
import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity,
    Image, Alert, TextInput, Platform, StatusBar, ActivityIndicator,
    Animated, Easing // Importar Animated e Easing
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { auth, db } from '../../firebaseConfig';
import { collection, addDoc, onSnapshot, query, where, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { PokemonTheme } from '../theme/PokemonTheme';

const ShoppingListScreen = ({ navigation }) => {
  // Estados da tela
  const [shoppingList, setShoppingList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newItemName, setNewItemName] = useState('');
  const userId = auth.currentUser?.uid;
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
    // Se não houver usuário, não faz nada e para o carregamento
    if (!userId) {
      setIsLoading(false);
      setShoppingList([]);
      return;
    }

    setIsLoading(true);
    const shoppingListCollectionRef = collection(db, 'users', userId, 'shoppingList');

    const unsubscribe = onSnapshot(shoppingListCollectionRef, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((documentSnapshot) => {
        items.push({ id: documentSnapshot.id, ...documentSnapshot.data() });
      });
      items.sort((a, b) => {
        if (a.purchased === b.purchased) {
          return (b.addedAt?.toDate() || 0) - (a.addedAt?.toDate() || 0);
        }
        return a.purchased ? 1 : -1;
      });
      setShoppingList(items);
      setIsLoading(false);
    }, (error) => {
      console.error("Erro ao buscar lista de compras: ", error);
      Alert.alert("Erro", "Não foi possível carregar sua lista de compras.");
      setIsLoading(false);
    });

    animatePokeball(); // Inicia a animação ao montar o componente
    return () => unsubscribe();
  }, [userId]);

  const handleAddItem = async () => {
    if (!newItemName.trim() || !userId) return;
    try {
      const shoppingListCollectionRef = collection(db, 'users', userId, 'shoppingList');
      await addDoc(shoppingListCollectionRef, {
        name: newItemName.trim(),
        addedAt: new Date(),
        purchased: false,
      });
      setNewItemName('');
    } catch (error) {
      console.error("Erro ao adicionar item: ", error);
      Alert.alert("Erro", "Não foi possível adicionar o item à lista.");
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!userId) return;
    Alert.alert(
      "Remover Item",
      "Tem certeza que deseja remover este item da lista?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            try {
              const itemDocRef = doc(db, 'users', userId, 'shoppingList', itemId);
              await deleteDoc(itemDocRef);
            } catch (error) {
              console.error("Erro ao remover item: ", error);
              Alert.alert("Erro", "Não foi possível remover o item da lista.");
            }
          }
        }
      ]
    );
  };

  const toggleItemPurchased = async (item) => {
    if (!userId) return;
    try {
      const itemDocRef = doc(db, 'users', userId, 'shoppingList', item.id);
      await updateDoc(itemDocRef, {
        purchased: !item.purchased
      });
    } catch (error) {
      console.error("Erro ao atualizar item: ", error);
      Alert.alert("Erro", "Não foi possível atualizar o status do item.");
    }
  };

  if (isLoading) {
    return (
      <LinearGradient colors={[PokemonTheme.colors.background, PokemonTheme.colors.border]} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={PokemonTheme.colors.accent} />
        <Text style={styles.loadingText}>Carregando lista de compras...</Text>
      </LinearGradient>
    );
  }

  if (!userId) {
     return (
      <LinearGradient colors={[PokemonTheme.colors.background, PokemonTheme.colors.border]} style={styles.fullMessageContainer}>
        <Icon name="lock-outline" size={50} color={PokemonTheme.colors.secondaryText} />
        <Text style={styles.fullMessageText}>Faça login para ver e gerenciar sua lista de compras.</Text>
      </LinearGradient>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={[PokemonTheme.colors.background, PokemonTheme.colors.border]} style={styles.gradientBackground}>
        <StatusBar barStyle="dark-content" backgroundColor={PokemonTheme.colors.background} />
        {/* Cabeçalho da tela */}
        <LinearGradient
          colors={[PokemonTheme.colors.headerGradientStart, PokemonTheme.colors.headerGradientEnd]}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Animated.Image // Usando Animated.Image diretamente
            source={require('../../assets/pokeball.png')}
            style={[styles.pokeballIcon, { transform: [{ rotate: rotateInterpolate }] }]}
          />
          <Text style={styles.title}>Lista de Compras</Text>
        </LinearGradient>

        {/* Container para adicionar novo item */}
        <View style={styles.addItemContainer}>
          <View style={styles.inputWrapper}>
            <Icon name="plus-circle-outline" size={24} color={PokemonTheme.colors.accent} style={styles.inputIcon} />
            <TextInput
              placeholder="Adicionar carta à lista..."
              value={newItemName}
              onChangeText={setNewItemName}
              style={styles.input}
              placeholderTextColor={PokemonTheme.colors.placeholderText}
              onSubmitEditing={handleAddItem}
            />
          </View>
          <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
            <Icon name="plus" size={28} color={PokemonTheme.colors.card} />
          </TouchableOpacity>
        </View>

        {/* Lista de compras ou mensagem de lista vazia */}
        {shoppingList.length === 0 ? (
          <View style={styles.emptyListContainer}>
            <Icon name="cart-remove" size={80} color={PokemonTheme.colors.placeholderText} />
            <Text style={styles.emptyListText}>Sua lista de compras está vazia.</Text>
            <Text style={styles.emptyListSubText}>Adicione cartas que você deseja adquirir!</Text>
          </View>
        ) : (
          <FlatList
            data={shoppingList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => toggleItemPurchased(item)} activeOpacity={0.7}>
                <LinearGradient
                  colors={[PokemonTheme.colors.cardGradientStart, PokemonTheme.colors.cardGradientEnd]}
                  style={[styles.listItem, item.purchased && styles.listItemPurchased]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {item.imageUrl ?
                      (<Image source={{uri: item.imageUrl}} style={styles.itemImage} />)
                      :
                     (<View style={styles.itemImagePlaceholder}>
                        <Icon name="image-off-outline" size={30} color={PokemonTheme.colors.placeholderText} />
                     </View>)
                  }
                  <View style={styles.itemTextContainer}>
                      <Text style={[styles.itemName, item.purchased && styles.itemNamePurchased]}>
                          {item.name}
                      </Text>
                      {item.set?.name && <Text style={styles.itemSet}>{item.set.name}</Text>}
                  </View>
                  <TouchableOpacity onPress={() => handleRemoveItem(item.id)} style={styles.deleteButton}>
                    <Icon name="trash-can-outline" size={24} color={PokemonTheme.colors.notification} />
                  </TouchableOpacity>
                </LinearGradient>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.listContentContainer}
          />
        )}
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
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 15 : 40,
    paddingBottom: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    ...PokemonTheme.shadows.header,
    marginBottom: 10,
  },
  pokeballIcon: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  title: {
    ...PokemonTheme.textVariants.header,
    fontSize: 22,
    color: PokemonTheme.colors.card,
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
  fullMessageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: PokemonTheme.colors.background,
  },
  fullMessageText: {
    fontSize: 18,
    color: PokemonTheme.colors.text,
    textAlign: 'center',
    marginTop: 15,
  },
  addItemContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
    marginTop: 5,
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PokemonTheme.colors.inputBackground,
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: PokemonTheme.colors.inputBorder,
    ...PokemonTheme.shadows.input,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: PokemonTheme.colors.text,
  },
  addButton: {
    padding: 10,
    backgroundColor: PokemonTheme.colors.primary,
    borderRadius: 25,
    marginLeft: 10,
    ...PokemonTheme.shadows.button,
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    marginTop: 50,
  },
  emptyListText: {
    fontSize: 18,
    fontWeight: '600',
    color: PokemonTheme.colors.secondaryText,
    textAlign: 'center',
    marginTop: 15,
  },
  emptyListSubText: {
    fontSize: 14,
    color: PokemonTheme.colors.placeholderText,
    textAlign: 'center',
    marginTop: 8,
  },
  listContentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  listItem: {
    flexDirection: 'row',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginBottom: 12,
    ...PokemonTheme.shadows.card,
  },
  listItemPurchased: {
    opacity: 0.7,
    backgroundColor: PokemonTheme.colors.cardGradientEnd,
  },
  itemImage: {
      width: 55,
      height: 77,
      borderRadius: 6,
      marginRight: 15,
      borderWidth: 1,
      borderColor: PokemonTheme.colors.border,
  },
  itemImagePlaceholder: {
      width: 55,
      height: 77,
      borderRadius: 6,
      marginRight: 15,
      backgroundColor: PokemonTheme.colors.inputBackground,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: PokemonTheme.colors.inputBorder,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemName: {
    ...PokemonTheme.textVariants.cardTitle,
  },
  itemNamePurchased: {
    textDecorationLine: 'line-through',
    color: PokemonTheme.colors.placeholderText,
  },
  itemSet: {
    ...PokemonTheme.textVariants.cardSubtitle,
    marginTop: 2,
  },
  deleteButton: {
    padding: 10,
    marginLeft: 10,
  },
});

export default ShoppingListScreen;
