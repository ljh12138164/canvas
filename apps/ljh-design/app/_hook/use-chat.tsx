import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { useUser } from '../_store/auth';
import { useSocket } from '../_store/chat';

/**
 * ### 聊天
 */
export const useChat = () => {
  const { setSocket } = useSocket();
  const { user } = useUser();
  useEffect(() => {
    if (!user?.user.id) return;
    const socketInstance = io('wss://designsocket.ljhboard.cn', {
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 10000,
      path: '/socket.io/',
      transports: ['websocket'],
    });
    socketInstance.on('connect', () => {
      setSocket(socketInstance);
      socketInstance.emit('connectChat', user.user.id);
      socketInstance.emit('initChat', { userId: user.user.id });
      socketInstance.on('reconnect', () => {
        // 重新连接成功
        socketInstance.emit('connectChat', user.user.id);
      });
    });
    // 组件卸载时清理
    return () => {
      socketInstance.disconnect();
    };
  }, [user?.user.id]);
};
