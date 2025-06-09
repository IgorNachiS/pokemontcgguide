import { DefaultTheme } from '@react-navigation/native';
import { configureFonts } from 'react-native-paper';

const fontConfig = {
  default: {
    regular: {
      fontFamily: 'Roboto-Regular',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Roboto-Medium',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'Roboto-Light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Roboto-Thin',
      fontWeight: 'normal',
    },
  },
};

export const PokemonTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3B4CCA',
    background: '#F0F0F0',
    card: '#FFFFFF',
    text: '#1A1A1A',
    secondaryText: '#666666',
    placeholderText: '#999999',
    border: '#E0E0E0',
    notification: '#CC0000',
    accent: '#FFDE00',
    success: '#4CAF50',
    warning: '#FF9800',

    headerGradientStart: '#E53935',
    headerGradientEnd: '#C62828',
    cardGradientStart: '#FFFFFF',
    cardGradientEnd: '#F5F5F5',
    modalHeaderGradientStart: '#E53935',
    modalHeaderGradientEnd: '#C62828',
    detailScreenGradientStart: '#3a1c71',
    detailScreenGradientMid: '#d76d77',
    detailScreenGradientEnd: '#ffaf7b',
    loginGradientStart: '#3B4CCA',
    loginGradientEnd: '#000000',
    profileGradientStart: '#3B4CCA',
    profileGradientEnd: '#000000',
    shoppingListGradientStart: '#FFCB05',
    shoppingListGradientEnd: '#FF905A',

    inputBackground: '#F0F0F0',
    inputBorder: '#D0D0D0',
    toggleActive: '#E53935',
    toggleInactive: '#CCCCCC',
    sliderThumb: '#E53935',
    sliderTrack: '#DDDDDD',
    tabInactiveBackground: 'rgba(255,255,255,0.2)',
    tabActivePokemon: '#B19CD9',
    tabActiveTrainers: '#81C784',
    tabActiveEnergy: '#FFD740',
    tabActiveBuyList: '#FFB6C1',
  },
  fonts: configureFonts({ config: fontConfig }),
  pokemon: {
    types: {
      grass: '#78C850',
      fire: '#F08030',
      water: '#6890F0',
      lightning: '#F8D030',
      psychic: '#F85888',
      fighting: '#C03028',
      darkness: '#705848',
      metal: '#B8B8D0',
      dragon: '#7038F8',
      fairy: '#EE99AC',
      colorless: '#A8A878',
    }
  },
  textVariants: {
    header: {
      fontSize: 32,
      fontWeight: 'bold',
      color: '#FFFFFF',
      textShadowColor: 'rgba(0,0,0,0.2)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#1A1A1A',
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#333333',
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333333',
    },
    cardSubtitle: {
      fontSize: 14,
      color: '#666666',
    },
    body: {
      fontSize: 16,
      color: '#1A1A1A',
    },
    small: {
      fontSize: 12,
      color: '#666666',
    },
    buttonText: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#FFFFFF',
    },
    inputLabel: {
      fontSize: 14,
      color: '#666666',
    },
    modalTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#FFFFFF',
      textAlign: 'center',
      textShadowColor: 'rgba(0,0,0,0.2)',
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    detailLabel: {
      fontWeight: 'bold',
      color: '#666666',
    },
    detailValue: {
      color: '#333333',
    },
  },
  shadows: {
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    button: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    input: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    header: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.3,
      shadowRadius: 6,
      elevation: 8,
    },
  }
};