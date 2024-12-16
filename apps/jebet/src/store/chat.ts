import { makeAutoObservable } from 'mobx';
import { Socket } from 'socket.io-client';
class ChatStore {
  socket: Socket | null = null;
  //   messages: Message[] = [];
  constructor() {
    makeAutoObservable(this);
  }
}
export default ChatStore;
