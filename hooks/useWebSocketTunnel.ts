import { useState, useRef, useCallback, useEffect } from 'react';
import { ConnectionStatus, LogEntry, Protocol } from '../types';
import { parsePayload, generateId } from '../utils/payloadParser';

export const useWebSocketTunnel = () => {
  const [status, setStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  const addLog = useCallback((message: string, type: LogEntry['type'] = 'info') => {
    setLogs(prev => [...prev, {
      id: generateId(),
      timestamp: new Date().toLocaleTimeString(),
      message,
      type
    }]);
  }, []);

  const connect = useCallback((host: string, port: string, protocol: Protocol, payload: string, usePayload: boolean) => {
    if (status === ConnectionStatus.CONNECTED || status === ConnectionStatus.CONNECTING) return;

    setStatus(ConnectionStatus.CONNECTING);
    addLog(`Initializing ${protocol} tunnel to ${host}:${port}...`, 'system');

    // Simulation check for non-WS protocols (Browser limitation)
    if (protocol !== Protocol.WEBSOCKET) {
      setTimeout(() => {
        addLog(`Browser Sandbox Restriction: Direct ${protocol} not supported natively.`, 'error');
        addLog('Switching to Simulation/WebSocket Mode...', 'system');
      }, 500);
    }

    // Use a public echo server for demonstration if standard port, otherwise try direct
    // Note: In a real app, this would point to a Websockify proxy
    const targetUrl = (host.includes('echo') || protocol === Protocol.WEBSOCKET) 
      ? `wss://${host}:${port}/` 
      : `wss://echo.websocket.org`; 

    addLog(`Resolving host: ${host}...`, 'system');

    try {
      const ws = new WebSocket(targetUrl);
      socketRef.current = ws;

      ws.onopen = () => {
        setStatus(ConnectionStatus.CONNECTED);
        addLog('Connection established successfully.', 'system');
        
        if (usePayload) {
          addLog('Injecting payload...', 'system');
          const frames = parsePayload(payload, host, port);
          
          frames.forEach((frame, index) => {
            setTimeout(() => {
              if (socketRef.current?.readyState === WebSocket.OPEN) {
                socketRef.current.send(frame);
                addLog(frame.replace(/\r\n/g, '\\r\\n'), 'tx');
              }
            }, index * 200); // Stagger frames
          });
        } else {
            // Keep alive ping for demo
            ws.send('PING');
        }
      };

      ws.onmessage = (event) => {
        addLog(`${event.data}`, 'rx');
      };

      ws.onerror = (event) => {
        addLog('Connection Error. Ensure host supports WSS or allow mixed content.', 'error');
      };

      ws.onclose = () => {
        setStatus(ConnectionStatus.DISCONNECTED);
        addLog('Connection closed.', 'system');
        socketRef.current = null;
      };

    } catch (e) {
      setStatus(ConnectionStatus.ERROR);
      addLog(`Critical Error: ${e}`, 'error');
    }
  }, [status, addLog]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
    }
    setStatus(ConnectionStatus.DISCONNECTED);
    addLog('User initiated disconnect.', 'system');
  }, [addLog]);

  const clearLogs = () => setLogs([]);

  return { status, logs, connect, disconnect, clearLogs };
};