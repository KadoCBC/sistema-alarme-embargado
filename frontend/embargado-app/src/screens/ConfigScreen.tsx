import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import SimpleButton from '../components/SimpleButton';
import SimpleInput from '../components/SimpleInput';
import { API_BASE_URL } from '../config/api';

const ConfigScreen: React.FC = () => {
  // Estado para as 3 variáveis
  const [config, setConfig] = useState({
    variavel1: 0,
    variavel2: 0,
    variavel3: 0,
  });
  const [loading, setLoading] = useState(false);

  // Buscar configurações atuais ao abrir a tela
  useEffect(() => {
    console.log('Tentando carregar configurações de:', `${API_BASE_URL}/configuracoes`);
    
    fetch(`${API_BASE_URL}/configuracoes`)
      .then(res => {
        console.log('Resposta do servidor:', res.status, res.statusText);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Dados recebidos:', data);
        setConfig({
          variavel1: data.sensibilidade || 0,
          variavel2: data.tempo_buzzer || 0,
          variavel3: data.intervalo_consulta || 0,
        });
      })
      .catch((error) => {
        console.error('Erro ao carregar configurações:', error);
        Alert.alert('Erro', `Não foi possível carregar as configurações: ${error.message}`);
      });
  }, []);

  // Função para salvar configurações
  const saveConfig = () => {
    setLoading(true);
    console.log('Tentando salvar configurações:', config);
    
    fetch(`${API_BASE_URL}/configuracoes`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        variavel1: config.variavel1,
        variavel2: config.variavel2,
        variavel3: config.variavel3,
      }),
    })
      .then(res => {
        console.log('Resposta do servidor (salvar):', res.status, res.statusText);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log('Configurações salvas com sucesso:', data);
        Alert.alert('Sucesso', 'Configurações salvas com sucesso!');
      })
      .catch((error) => {
        console.error('Erro ao salvar configurações:', error);
        Alert.alert('Erro', `Não foi possível salvar as configurações: ${error.message}`);
      })
      .finally(() => setLoading(false));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔒 Configuração do Alarme</Text>
        <Text style={styles.subtitle}>Ajuste os parâmetros do sistema</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Parâmetros de Configuração</Text>
        <SimpleInput
          label="Variável 1"
          value={config.variavel1.toString()}
          onChangeText={text => setConfig({ ...config, variavel1: parseInt(text) || 0 })}
          placeholder="50"
          keyboardType="numeric"
        />
        <SimpleInput
          label="Variável 2"
          value={config.variavel2.toString()}
          onChangeText={text => setConfig({ ...config, variavel2: parseInt(text) || 0 })}
          placeholder="30"
          keyboardType="numeric"
        />
        <SimpleInput
          label="Variável 3"
          value={config.variavel3.toString()}
          onChangeText={text => setConfig({ ...config, variavel3: parseInt(text) || 0 })}
          placeholder="75"
          keyboardType="numeric"
        />
      </View>
      <View style={styles.section}>
        <SimpleButton
          title="Salvar Configurações"
          onPress={saveConfig}
          loading={loading}
        />
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