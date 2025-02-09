import { useState } from 'react';
import AI from '../../Ai/AiContent';
import AiList from '../../Ai/AiList';

export const AiChatSider = () => {
  const [selectChat, setSelectChat] = useState<string>('');
  if (!selectChat) {
    return (
      <div className="flex flex-col gap-2">
        <AiList type="sider" onClick={(id) => setSelectChat(id)} />
      </div>
    );
  }
  return <AI id={selectChat} type="sider" onClick={() => setSelectChat('')} />;
};
