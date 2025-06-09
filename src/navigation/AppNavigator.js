import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from '../screens/LoginScreen';
import { DrawerNavigator } from './DrawerNavigator';
import { useAuth } from '../hooks/useAuth';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { CardDetailScreen } from '../screens/CardDetailScreen';

const Stack = createStackNavigator();

export const AppNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingIndicator />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="Main" component={DrawerNavigator} />
          <Stack.Screen name="CardDetail" component={CardDetailScreen} />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};