import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

export default function Emoji() {
  return <Picker data={data} onEmojiSelect={console.log} locale="zh" />;
}
