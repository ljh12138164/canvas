import { ActiveUser } from '@/types/chat';
import { makeAutoObservable } from 'mobx';
import { Socket } from 'socket.io-client';
class ChatStore {
  // 连接socket.io
  socket: Socket | null = null;
  //   messages: Message[] = [];
  activeUser: ActiveUser[] = [];
  // 连接人数自己
  connectCount: number = 1;
  // 当前聊天对象
  constructor() {
    makeAutoObservable(this);
  }
  setActiveUser(user: ActiveUser[]) {
    this.activeUser = this.activeUser.concat(user);
    this.connectCount = this.activeUser.length;
  }
  setConnectCount(count: number) {
    this.connectCount = count;
  }
}
const chatStore = new ChatStore();
export default chatStore;
