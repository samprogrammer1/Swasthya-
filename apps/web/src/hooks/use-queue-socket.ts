import { useEffect, useState } from 'react';

export function useQueueSocket(
  doctorId: string,
  onQueueUpdate?: (data: any) => void,
  onTokenCalled?: (data: any) => void,
) {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!doctorId) return;

    // Check if Socket.io client script is available, else fallback cleanly
    let socket: any = null;

    try {
      const io = (window as any).io;
      if (io) {
        socket = io('http://localhost:4000/queue', {
          transports: ['websocket'],
        });

        socket.on('connect', () => {
          setIsConnected(true);
          socket.emit('subscribe_queue', { doctorId });
        });

        socket.on('QUEUE_UPDATED', (data: any) => {
          if (onQueueUpdate) onQueueUpdate(data);
        });

        socket.on('TOKEN_CALLED', (data: any) => {
          if (onTokenCalled) onTokenCalled(data);
        });

        socket.on('disconnect', () => {
          setIsConnected(false);
        });
      }
    } catch (e) {
      // Fallback
    }

    return () => {
      if (socket) {
        socket.emit('unsubscribe_queue', { doctorId });
        socket.disconnect();
      }
    };
  }, [doctorId]);

  return { isConnected };
}
