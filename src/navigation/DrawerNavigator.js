import { createDrawerNavigator } from '@react-navigation/drawer';
import { DashboardScreen } from '../screens/DashboardScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { AdvancedSearchScreen } from '../screens/AdvancedSearchScreen'; // Importar
import { ShoppingListScreen } from '../screens/ShoppingListScreen';     // Importar
import { CardDetailScreen } from '../screens/CardDetailScreen';         // Importar
import { CustomDrawer } from '../components/CustomDrawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { PokemonTheme } from '../theme/PokemonTheme'; // Importar o tema

const Drawer = createDrawerNavigator();

export const DrawerNavigator = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawer {...props} />}
    screenOptions={{
      headerShown: false, // Oculta o cabeçalho padrão, pois cada tela terá seu próprio cabeçalho estilizado
      drawerActiveTintColor: PokemonTheme.colors.primary, // Cor do item ativo no drawer
      drawerInactiveTintColor: PokemonTheme.colors.secondaryText, // Cor do item inativo no drawer
      drawerLabelStyle: {
        fontSize: 16,
        fontWeight: '500',
      },
      drawerStyle: {
        backgroundColor: PokemonTheme.colors.card, // Cor de fundo do drawer
      },
    }}
  >
    <Drawer.Screen
      name="Dashboard"
      component={DashboardScreen}
      options={{
        drawerIcon: ({ color }) => <Icon name="home" size={24} color={color} />,
        title: 'Início', // Título para o Drawer
      }}
    />
    <Drawer.Screen
      name="AdvancedSearch"
      component={AdvancedSearchScreen}
      options={{
        drawerIcon: ({ color }) => <Icon name="card-search" size={24} color={color} />,
        title: 'Busca Avançada', // Título para o Drawer
      }}
    />
    <Drawer.Screen
      name="ShoppingList"
      component={ShoppingListScreen}
      options={{
        drawerIcon: ({ color }) => <Icon name="format-list-checks" size={24} color={color} />,
        title: 'Lista de Compras', // Título para o Drawer
      }}
    />
    <Drawer.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        drawerIcon: ({ color }) => <Icon name="account" size={24} color={color} />,
        title: 'Perfil', // Título para o Drawer
      }}
    />
    {/* CardDetailScreen não é uma tela do drawer, mas é acessada por navegação */}
    <Drawer.Screen
      name="CardDetail"
      component={CardDetailScreen}
      options={{
        drawerItemStyle: { height: 0, overflow: 'hidden' }, // Esconde este item do drawer
        headerShown: false, // Garante que não apareça cabeçalho aqui
      }}
    />
  </Drawer.Navigator>
);
