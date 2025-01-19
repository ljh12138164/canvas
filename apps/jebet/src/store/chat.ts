import { makeAutoObservable } from "mobx";
import { Socket } from "socket.io-client";
class ChatStore {
  // 连接socket.io
  socket: Socket | null = null;
  //   messages: Message[] = [];
  // 连接人数自己
  connectCount: number = 1;
  isConnected: boolean = false;
  constructor() {
    makeAutoObservable(this);
  }
  // 设置socket
  setSocket(socket: Socket) {
    this.socket = socket;
  }

  setConnectCount(count: number) {
    this.connectCount = count;
  }
  setIsConnected(isConnected: boolean) {
    this.isConnected = isConnected;
  }
}
const chatStore = new ChatStore();
export default chatStore;
