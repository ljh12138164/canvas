import { useEffect, useState } from 'react';
import { type Socket, io } from 'socket.io-client';
import { useSocket } from '../_store/chat';
// import socket

/**
 * ### 聊天
 */
export const useChat = () => {
  const { setSocket } = useSocket();
  useEffect(() => {
    const socketInstance = io('ws://localhost:8088/', {
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 10000,
      // 使用websocket连接
      path: '/socket.io/',
      transports: ['websocket'],
    });
    socketInstance.on('connect', () => {
      setSocket(socketInstance);
      // socketInstance.emit('connectChat', );
      //初始化
      socketInstance.on('', () => {});

      // 断开连接
      socketInstance.on('leaveChat', () => {});
      // 有人加入聊天
      socketInstance.on('joinChat', () => {});

      socketInstance.on('connect_error', () => {});

      socketInstance.on('reconnect', () => {});
      socketInstance.on('sendMessage', () => {});
    });
    socketInstance.on('disconnect', () => {});
  }, []);
};
