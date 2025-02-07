'use client';
import { Button } from '@/app/_components/ui/button';
import { useAi, useAiAnswer, useAiChat } from '@/app/_hook/query/useAi';

const AI = () => {
  const { getAiStream } = useAi();
  const { getAiAnswer } = useAiAnswer();
  const { getAiChat } = useAiChat();

  return (
    <div className="flex  gap-2">
      <Button>上下文流式传输</Button>
      <Button
        onClick={() =>
          getAiAnswer(
            { json: { prompt: '天气怎么样' } },
            {
              onSuccess() {},
            },
          )
        }
      >
        文本传输
      </Button>
      <Button
        onClick={() =>
          getAiChat(
            { json: { prompt: 'ai是怎么实现的' } },
            {
              onSuccess(data) {
                const reader = data.getReader();
                // 流式上下文
                function readStream() {
                  reader.read().then(({ done, value }) => {
                    if (done) return;
                    // 解密buffer类型为utf-8
                    const text = new TextDecoder('utf-8').decode(value);
                    // console.log(text);
                    readStream();
                  });
                }
                readStream();
              },
            },
          )
        }
      >
        流式传输
      </Button>
    </div>
  );
};

export default AI;
