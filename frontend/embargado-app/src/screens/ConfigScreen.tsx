import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import SimpleButton from '../components/SimpleButton';
import SimpleInput from '../components/SimpleInput';

const ConfigScreen: React.FC = () => {
  // Estados para as 3 variáveis de configuração
  const [config, setConfig] = useState({
    variavel1: 50,
    variavel2: 30,
    variavel3: 75,
  });

  const [loading, setLoading] = useState(false);

  // Salvar configurações
  const saveConfig = () => {
    setLoading(true);
    // Simular delay
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Sucesso', 'Configurações salvas com sucesso!');
    }, 1000);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Título */}
      <View style={styles.header}>
        <Text style={styles.title}>Configuração do Alarme</Text>
        <Text style={styles.subtitle}>Ajuste os parâmetros do sistema</Text>
      </View>

      {/* Configurações */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Parâmetros de Configuração</Text>
        
        <SimpleInput
          label="Variável 1"
          value={config.variavel1.toString()}
          onChangeText={(text) => setConfig({ ...config, variavel1: parseInt(text) || 0 })}
          placeholder="50"
          keyboardType="numeric"
        />

        <SimpleInput
          label="Variável 2"
          value={config.variavel2.toString()}
          onChangeText={(text) => setConfig({ ...config, variavel2: parseInt(text) || 0 })}
          placeholder="30"
          keyboardType="numeric"
        />

        <SimpleInput
          label="Variável 3"
          value={config.variavel3.toString()}
          onChangeText={(text) => setConfig({ ...config, variavel3: parseInt(text) || 0 })}
          placeholder="75"
          keyboardType="numeric"
        />
      </View>

      {/* Botão Salvar */}
      <View style={styles.section}>
        <SimpleButton
          title="Salvar Configurações"
          onPress={saveConfig}
          loading={loading}
        />
      </View>

      {/* Informações */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações</Text>
        <Text style={styles.infoText}>
          Configure os parâmetros do sistema de alarme embargado.
          {'\n\n'}
          • Variável 1: Parâmetro de sensibilidade
          {'\n'}
          • Variável 2: Parâmetro de tempo
          {'\n'}
          • Variável 3: Parâmetro de intensidade
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  section: {
    margin: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default ConfigScreen; 