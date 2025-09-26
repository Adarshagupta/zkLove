/**
 * zkLove - Privacy-first dating app with zero-knowledge proofs
 * Main App component with navigation setup
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screens
import RegistrationScreen from './src/screens/RegistrationScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import MatchScreen from './src/screens/MatchScreen';
import RevealScreen from './src/screens/RevealScreen';
import AuraScreen from './src/screens/AuraScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Registration"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#FF6B9D', // zkLove pink
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Registration" 
            component={RegistrationScreen}
            options={{ title: 'zkLove Registration' }}
          />
          <Stack.Screen 
            name="Profile" 
            component={ProfileScreen}
            options={{ title: 'Your Profile' }}
          />
          <Stack.Screen 
            name="Match" 
            component={MatchScreen}
            options={{ title: 'Find Matches' }}
          />
          <Stack.Screen 
            name="Reveal" 
            component={RevealScreen}
            options={{ title: 'Reveal Identity' }}
          />
          <Stack.Screen 
            name="Aura" 
            component={AuraScreen}
            options={{ title: 'Your Aura' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
