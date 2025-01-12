"use client";
import { Button } from "@/app/_components/ui/button";
import { useAi, useAiAnswer, useAiChat } from "@/app/_hook/query/useAi";

const AI = () => {
  const { getAiStream } = useAi();
  const { getAiAnswer } = useAiAnswer();
  const { getAiChat } = useAiChat();

  return (
    <div className="flex  gap-2">
      <Button
        onClick={() =>
          getAiStream(
            {
              json: {
                prompt: "我们刚刚聊了什么",
                history: [
                  { role: "user", parts: [{ text: "今天天气怎么样" }] },
                  {
                    role: "model",
                    parts: [
                      {
                        text: "您好！请问您想了解哪个地方的天气呢？ 请告诉我您所在的城市或想查询的地点，我会尽力为您提供准确的天气信息。例如，您可以说：*   “北京今天天气怎么样？”*   “明天上海会下雨吗？”*   “纽约现在天气如何？”您提供的信息越具体，我给您的答案就越准确。",
                      },
                    ],
                  },
                ],
              },
            },
            {
              onSuccess(data) {
                const reader = data.getReader();
                // 流式上下文
                function readStream() {
                  reader.read().then(({ done, value }) => {
                    if (done) return;
                    // 解密buffer类型为utf-8
                    const text = new TextDecoder("utf-8").decode(value);
                    console.log(text);
                    readStream();
                  });
                }
                readStream();
              },
            }
          )
        }
      >
        上下文流式传输
      </Button>
      <Button
        onClick={() =>
          getAiAnswer(
            { json: { prompt: "天气怎么样" } },
            {
              onSuccess(data) {
                console.log(data);
              },
            }
          )
        }
      >
        文本传输
      </Button>
      <Button
        onClick={() =>
          getAiChat(
            { json: { prompt: "ai是怎么实现的" } },
            {
              onSuccess(data) {
                const reader = data.getReader();
                // 流式上下文
                function readStream() {
                  reader.read().then(({ done, value }) => {
                    if (done) return;
                    // 解密buffer类型为utf-8
                    const text = new TextDecoder("utf-8").decode(value);
                    console.log(text);
                    readStream();
                  });
                }
                readStream();
              },
            }
          )
        }
      >
        流式传输
      </Button>
    </div>
  );
};

export default AI;
