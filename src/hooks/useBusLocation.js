import { useCallback, useRef, useState } from 'react';

const useBusLocation = (busId) => {
  const [location, setLocation] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef(null);

  const connect = useCallback(() => {
    if (!busId || wsRef.current) return;

    // WebSocket bağlantısı oluştur
    const ws = new WebSocket(`ws://localhost:8000/ws/bus/${busId}/location`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log(`WebSocket connected for bus ${busId}`);
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(`Location update for bus ${busId}:`, data);
      setLocation(data);
    };

    ws.onerror = (error) => {
      console.error(`WebSocket error for bus ${busId}:`, error);
    };

    ws.onclose = () => {
      console.log(`WebSocket disconnected for bus ${busId}`);
      setIsConnected(false);
      wsRef.current = null;
    };
  }, [busId]);

  const disconnect = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  // Konum gönderme fonksiyonu
  const sendLocation = useCallback((latitude, longitude) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const data = {
        latitude,
        longitude,
        timestamp: new Date().toISOString()
      };
      wsRef.current.send(JSON.stringify(data));
      console.log(`Sent location for bus ${busId}:`, data);
      return true;
    }
    console.error('WebSocket is not connected');
    return false;
  }, [busId]);

  return { location, isConnected, connect, disconnect, sendLocation };
};

export default useBusLocation;
