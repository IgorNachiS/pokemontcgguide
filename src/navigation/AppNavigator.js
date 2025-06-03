import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from '../screens/LoginScreen';
import { DrawerNavigator } from './DrawerNavigator';
import { useAuth } from '../hooks/useAuth';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { CardDetailScreen } from '../screens/CardDetailScreen'; // Importar CardDetailScreen aqui também

const Stack = createStackNavigator();

export const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingIndicator />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        // Se o usuário estiver logado, navega para o DrawerNavigator
        // E também permite a navegação para CardDetailScreen diretamente
        <>
          <Stack.Screen name="Main" component={DrawerNavigator} />
          <Stack.Screen name="CardDetail" component={CardDetailScreen} />
        </>
      ) : (
        // Se o usuário não estiver logado, navega para a tela de Login
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};
