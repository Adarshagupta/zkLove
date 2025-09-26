import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {StatusBar, StyleSheet} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {RootStackParamList} from '@types/index';
import HomeScreen from '@screens/HomeScreen';
import FaceVerificationScreen from '@screens/FaceVerificationScreen';
import IDVerificationScreen from '@screens/IDVerificationScreen';
import ProofGenerationScreen from '@screens/ProofGenerationScreen';
import VerificationCompleteScreen from '@screens/VerificationCompleteScreen';

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#6366f1',
            },
            headerTintColor: '#ffffff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{title: 'ZK Identity Verification'}}
          />
          <Stack.Screen
            name="FaceVerification"
            component={FaceVerificationScreen}
            options={{title: 'Face Verification'}}
          />
          <Stack.Screen
            name="IDVerification"
            component={IDVerificationScreen}
            options={{title: 'ID Verification'}}
          />
          <Stack.Screen
            name="ProofGeneration"
            component={ProofGenerationScreen}
            options={{title: 'Generating Proof'}}
          />
          <Stack.Screen
            name="VerificationComplete"
            component={VerificationCompleteScreen}
            options={{title: 'Verification Complete'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
