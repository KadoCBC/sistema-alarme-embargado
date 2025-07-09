import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';

// Importar tela de configuração
import ConfigScreen from './src/screens/ConfigScreen';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <ConfigScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
});
