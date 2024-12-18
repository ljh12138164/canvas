import chatStore from '@/store/chat';
import { observer } from 'mobx-react-lite';

const ChatMeta = observer(() => {
  const { activeUser } = chatStore;
  console.log(activeUser);
  return (
    <div>
      <div>
        <p>在线人数</p>
        <p>{activeUser.length}</p>
      </div>
    </div>
  );
});

export default ChatMeta;
