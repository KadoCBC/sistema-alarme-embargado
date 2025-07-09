import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface SimpleButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  loading?: boolean;
  disabled?: boolean;
}

const SimpleButton: React.FC<SimpleButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
}) => {
  const getButtonStyle = () => {
    const baseStyle = {
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      opacity: disabled ? 0.6 : 1,
    };

    switch (variant) {
      case 'primary':
        return { ...baseStyle, backgroundColor: '#007AFF' };
      case 'secondary':
        return { ...baseStyle, backgroundColor: 'transparent', borderWidth: 1, borderColor: '#007AFF' };
      case 'danger':
        return { ...baseStyle, backgroundColor: '#FF3B30' };
      default:
        return { ...baseStyle, backgroundColor: '#007AFF' };
    }
  };

  const getTextStyle = () => {
    const baseStyle = {
      fontSize: 16,
      fontWeight: '600',
      textAlign: 'center',
    };

    switch (variant) {
      case 'secondary':
        return { ...baseStyle, color: '#007AFF' };
      default:
        return { ...baseStyle, color: '#FFFFFF' };
    }
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' ? '#007AFF' : '#FFFFFF'} />
      ) : (
        <Text style={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  // Estilos inline para simplicidade
});

export default SimpleButton; 