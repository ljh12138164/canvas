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

    // designsocket.ljhboard.cn
    // 本地测试
    // const socketInstance = io('ws://localhost:8088/', {
    const socketInstance = io('wss://designsocket.ljhboard.cn', {
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 10000,
      path: '/socket.io/',
      transports: ['websocket'],
    });

    socketInstance.on('connect', () => {
      // 设置socket实例到全局状态
      setSocket(socketInstance);

      // 连接聊天，传递用户ID
      socketInstance.emit('connectChat', user.user.id);

      // 初始化聊天
      socketInstance.emit('initChat', { userId: user.user.id });

      // 监听接收消息
      socketInstance.on('receiveMessage', (message) => {
        // 这里可以添加消息到本地状态或触发刷新查询
        // 例如可以使用 queryClient.invalidateQueries(['messages'])
      });

      // 监听意识感知更新
      socketInstance.on('awarenessUpdate', (data) => {
        // 处理对方正在输入等状态
      });

      // 错误处理
      socketInstance.on('errorEvent', (error) => {
        // 处理错误
      });

      // 连接错误
      socketInstance.on('connect_error', () => {
        // 处理连接错误
      });

      // 重连成功
      socketInstance.on('reconnect', () => {
        // 重新连接成功
        socketInstance.emit('connectChat', user.user.id);
      });
    });

    // 断开连接
    socketInstance.on('disconnect', () => {
      // 处理断开连接
    });

    // 组件卸载时清理
    return () => {
      socketInstance.disconnect();
    };
  }, [user?.user.id]);
};
