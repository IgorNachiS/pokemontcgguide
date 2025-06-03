import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient'; // Importar LinearGradient
import { PokemonTheme } from '../theme/PokemonTheme';

const CardItem = ({ card, onPress, collectionStatus }) => {
  const cardType = card.types?.[0]?.toLowerCase() || 'colorless';
  const typeColor = PokemonTheme.pokemon.types[cardType] || '#A8A878';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.touchableContainer} // Novo estilo para o TouchableOpacity
    >
      <LinearGradient
        colors={[PokemonTheme.colors.cardGradientStart, PokemonTheme.colors.cardGradientEnd]}
        style={[styles.container, { borderLeftColor: typeColor }]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Image
          source={{ uri: card.images?.small || 'https://placehold.co/150x210/1B1464/FFCB05?text=Pok%C3%A9mon' }}
          style={styles.image}
          resizeMode="contain"
        />

        <View style={styles.infoContainer}>
          <Text style={styles.name} numberOfLines={1}>{card.name}</Text>
          <Text style={styles.set}>{card.set?.name || 'Set Desconhecido'}</Text>

          <View style={styles.metaContainer}>
            <View style={[styles.typeBadge, { backgroundColor: typeColor }]}>
              <Text style={styles.typeText}>{cardType.toUpperCase()}</Text>
            </View>
            <Text style={styles.number}>#{card.number || '??'}</Text>
          </View>
        </View>

        {collectionStatus && (
          <View style={[
            styles.statusBadge,
            collectionStatus === 'owned' && styles.owned,
            collectionStatus === 'wanted' && styles.wanted,
            collectionStatus === 'missing' && styles.missing,
          ]}>
            <Icon
              name={
                collectionStatus === 'owned' ? 'check' :
                collectionStatus === 'wanted' ? 'heart' : 'alert'
              }
              size={16}
              color={PokemonTheme.colors.card}
            />
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchableContainer: {
    marginBottom: 12, // Espaçamento entre os itens na lista
    marginHorizontal: 20, // Margem horizontal para alinhar com o design do App.js
    borderRadius: 15,
    overflow: 'hidden', // Garante que o gradiente e a sombra respeitem o borderRadius
    ...PokemonTheme.shadows.card, // Aplicando sombra do tema
  },
  container: {
    flexDirection: 'row',
    padding: 15,
    borderLeftWidth: 4, // Mantido para a cor do tipo
    minHeight: 112, // Altura mínima para consistência
    alignItems: 'center', // Centraliza verticalmente o conteúdo
  },
  image: {
    width: 80,
    height: 112,
    borderRadius: 5,
    marginRight: 15,
    borderWidth: 1, // Adicionado borda para a imagem
    borderColor: PokemonTheme.colors.border, // Cor da borda da imagem
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    ...PokemonTheme.textVariants.cardTitle,
    marginBottom: 3, // Espaçamento ajustado
  },
  set: {
    ...PokemonTheme.textVariants.cardSubtitle,
    marginBottom: 3, // Espaçamento ajustado
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5, // Espaçamento superior para separar do set
  },
  typeBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  typeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: PokemonTheme.colors.card,
  },
  number: {
    fontSize: 12,
    color: PokemonTheme.colors.placeholderText,
  },
  statusBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  owned: {
    backgroundColor: PokemonTheme.colors.success,
  },
  wanted: {
    backgroundColor: PokemonTheme.colors.notification,
  },
  missing: {
    backgroundColor: PokemonTheme.colors.warning,
  },
});

export default CardItem;
