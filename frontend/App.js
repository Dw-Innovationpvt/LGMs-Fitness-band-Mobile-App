import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './navigation/AuthStack';
// import { DataProvider } from './context/DataContext';

export default function App() {
  return (
  <NavigationContainer>
      <AuthStack />
    </NavigationContainer>
    
  );
}