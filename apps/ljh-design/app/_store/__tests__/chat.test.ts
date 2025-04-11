import type { Socket } from 'socket.io-client';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useSocket } from '../chat';

// 模拟 Socket.io-client
vi.mock('socket.io-client', () => ({
  io: vi.fn(() => mockSocket),
}));

// 创建一个模拟的 Socket 对象
const createMockSocket = (): Socket => {
  return {
    connect: vi.fn(),
    disconnect: vi.fn(),
    emit: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    id: 'mock-socket-id',
    connected: true,
    disconnected: false,
  } as unknown as Socket;
};

describe('useSocket Store', () => {
  let mockSocket: Socket;

  beforeEach(() => {
    // 创建一个新的 mock socket
    mockSocket = createMockSocket();

    // 重置 store 状态
    useSocket.setState({
      socket: null,
      setSocket: useSocket.getState().setSocket,
    });
  });

  it('初始状态应该是 socket=null', () => {
    const state = useSocket.getState();
    expect(state.socket).toBeNull();
  });

  it('setSocket 方法应该设置 socket', () => {
    // 调用 setSocket 方法
    useSocket.getState().setSocket(mockSocket);

    // 验证状态更新
    const state = useSocket.getState();
    expect(state.socket).toBe(mockSocket);
  });

  it('可以设置 socket 为 null', () => {
    // 先设置一个 socket
    useSocket.getState().setSocket(mockSocket);
    expect(useSocket.getState().socket).toBe(mockSocket);

    // 再设置为 null
    useSocket.getState().setSocket(null);

    // 验证状态更新
    const state = useSocket.getState();
    expect(state.socket).toBeNull();
  });
});
