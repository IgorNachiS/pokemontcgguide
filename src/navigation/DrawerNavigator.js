import { createDrawerNavigator } from '@react-navigation/drawer';
import { DashboardScreen } from '../screens/DashboardScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { AdvancedSearchScreen } from '../screens/AdvancedSearchScreen';
import { ShoppingListScreen } from '../screens/ShoppingListScreen';
import { CardDetailScreen } from '../screens/CardDetailScreen';
import { CustomDrawer } from '../components/CustomDrawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { PokemonTheme } from '../theme/PokemonTheme';

const Drawer = createDrawerNavigator();

export const DrawerNavigator = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawer {...props} />}
    screenOptions={{
      headerShown: false,
      drawerActiveTintColor: PokemonTheme.colors.primary,
      drawerInactiveTintColor: PokemonTheme.colors.secondaryText,
      drawerLabelStyle: {
        fontSize: 16,
        fontWeight: '500',
      },
      drawerStyle: {
        backgroundColor: PokemonTheme.colors.card,
      },
    }}
  >
    <Drawer.Screen
      name="Dashboard"
      component={DashboardScreen}
      options={{
        drawerIcon: ({ color }) => <Icon name="home" size={24} color={color} />,
        title: 'Início',
      }}
    />
    <Drawer.Screen
      name="AdvancedSearch"
      component={AdvancedSearchScreen}
      options={{
        drawerIcon: ({ color }) => <Icon name="card-search" size={24} color={color} />,
        title: 'Busca Avançada',
      }}
    />
    <Drawer.Screen
      name="ShoppingList"
      component={ShoppingListScreen}
      options={{
        drawerIcon: ({ color }) => <Icon name="format-list-checks" size={24} color={color} />,
        title: 'Lista de Compras',
      }}
    />
    <Drawer.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        drawerIcon: ({ color }) => <Icon name="account" size={24} color={color} />,
        title: 'Perfil',
      }}
    />
    <Drawer.Screen
      name="CardDetail"
      component={CardDetailScreen}
      options={{
        drawerItemStyle: { height: 0, overflow: 'hidden' },
        headerShown: false,
      }}
    />
  </Drawer.Navigator>
);