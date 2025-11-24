export enum ConnectionStatus {
  DISCONNECTED = 'Disconnected',
  CONNECTING = 'Connecting...',
  CONNECTED = 'Connected',
  ERROR = 'Error'
}

export enum Protocol {
  WEBSOCKET = 'WebSocket (WS)',
  SSH = 'SSH (Simulated)',
  TLS = 'TLS/SSL (Simulated)',
  TCP = 'Direct TCP (Simulated)'
}

export interface ServerProfile {
  id: string;
  name: string;
  host: string;
  port: string;
  username?: string;
  password?: string;
  payload: string;
  protocol: Protocol;
  usePayload: boolean;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'error' | 'tx' | 'rx' | 'system';
}