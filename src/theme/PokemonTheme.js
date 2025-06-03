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
    // Cores primárias baseadas no tema clássico Pokémon (vermelho e azul)
    primary: '#3B4CCA', // Azul escuro vibrante (Pokébola)
    background: '#F0F0F0', // Fundo claro para a maioria das telas
    card: '#FFFFFF', // Cor de fundo para cards e elementos brancos
    text: '#1A1A1A', // Cor principal do texto (quase preto)
    secondaryText: '#666666', // Cor para textos secundários
    placeholderText: '#999999', // Cor para texto de placeholder em inputs
    border: '#E0E0E0', // Cor de borda
    notification: '#CC0000', // Vermelho para notificações/erros (mais intenso)
    accent: '#FFDE00', // Amarelo vibrante (Pokébola)
    success: '#4CAF50', // Verde para sucesso
    warning: '#FF9800', // Laranja para avisos

    // Gradientes baseados no App.js de referência
    headerGradientStart: '#E53935', // Vermelho escuro para cabeçalhos
    headerGradientEnd: '#C62828',   // Vermelho mais escuro para cabeçalhos
    cardGradientStart: '#FFFFFF',   // Branco para cards de lista
    cardGradientEnd: '#F5F5F5',     // Cinza claro para cards de lista
    modalHeaderGradientStart: '#E53935', // Vermelho para cabeçalho do modal
    modalHeaderGradientEnd: '#C62828',   // Vermelho mais escuro para cabeçalho do modal
    detailScreenGradientStart: '#3a1c71', // Gradiente de tela de detalhes (roxo)
    detailScreenGradientMid: '#d76d77',   // Meio do gradiente (rosa)
    detailScreenGradientEnd: '#ffaf7b',   // Fim do gradiente (laranja)
    loginGradientStart: '#3B4CCA', // Azul para tela de login
    loginGradientEnd: '#000000',   // Preto para tela de login
    profileGradientStart: '#3B4CCA', // Azul para tela de perfil
    profileGradientEnd: '#000000',   // Preto para tela de perfil
    shoppingListGradientStart: '#FFCB05', // Amarelo para lista de compras
    shoppingListGradientEnd: '#FF905A',   // Laranja para lista de compras

    // Cores de fundo para inputs e elementos interativos
    inputBackground: '#F0F0F0',
    inputBorder: '#D0D0D0',
    toggleActive: '#E53935', // Cor para switch ativo
    toggleInactive: '#CCCCCC', // Cor para switch inativo
    sliderThumb: '#E53935',
    sliderTrack: '#DDDDDD',
    tabInactiveBackground: 'rgba(255,255,255,0.2)', // Abas de filtro inativas
    tabActivePokemon: '#B19CD9', // Roxo claro para Pokémon
    tabActiveTrainers: '#81C784', // Verde claro para Trainers
    tabActiveEnergy: '#FFD740', // Amarelo para Energy
    tabActiveBuyList: '#FFB6C1', // Rosa claro para Buy List
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
      color: '#FFFFFF', // Cor do texto do cabeçalho
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
