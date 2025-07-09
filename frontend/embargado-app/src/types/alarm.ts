// Tipos simples para o sistema de alarme embargado

export interface AlarmConfig {
  id: string;
  name: string;
  isActive: boolean;
  threshold: number;
  sensitivity: 'low' | 'medium' | 'high';
  notificationEnabled: boolean;
  autoReset: boolean;
  resetDelay: number; // em segundos
}

export interface AlarmStatus {
  isArmed: boolean;
  lastTriggered?: Date;
  batteryLevel: number;
  signalStrength: number;
}

export interface AlarmSettings {
  vibrationThreshold: number;
  soundThreshold: number;
  movementThreshold: number;
  notificationTypes: string[];
  emergencyContacts: string[];
  monitoringInterval: number; // em segundos
}

// Tipos para API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
} 