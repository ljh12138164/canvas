import { useEffect, useState } from "react";
import type { App } from "api";
import { hc } from "hono/client";

export const client = hc<App>("https://www.ljhboard.cn/").api.ai;

function App() {
  const [image, setImage] = useState<File | null>(null);
  useEffect(() => {
    async function readStreamed() {
      if (image) {
        const stream = await client.image.fileStream.$post({
          form: {
            image: image,
            prompt: "我们刚刚对话了什么",
            history: JSON.stringify([
              {
                role: "user",
                parts: [{ text: "图片" }],
              },
              {
                role: "model",
                parts: [{ text: "这张图很可爱！" }],
              },
              {
                role: "user",
                parts: [{ text: "图片" }],
              },
              {
                role: "model",
                parts: [{ text: "这张图很可爱！" }],
              },
              {
                role: "user",
                parts: [{ text: "图片" }],
              },
              {
                role: "model",
                parts: [{ text: "这张图很可爱！" }],
              },
              {
                role: "user",
                parts: [{ text: "图片" }],
              },
              {
                role: "model",
                parts: [{ text: "这张图很可爱！" }],
              },
              {
                role: "user",
                parts: [{ text: "图片" }],
              },
              {
                role: "model",
                parts: [{ text: "这张图很可爱！" }],
              },
              {
                role: "user",
                parts: [{ text: "图片" }],
              },
              {
                role: "model",
                parts: [{ text: "这张图很可爱！" }],
              },
            ]),
          },
        });
        const reader = stream.body?.getReader();
        // 流式上下文
        function readStream() {
          reader?.read().then(({ done, value }) => {
            if (done) return;
            // 解密buffer类型为utf-8
            const text = new TextDecoder("utf-8").decode(value);
            console.log(text);
            readStream();
          });
        }
        readStream();
      }
    }
    readStreamed();
  }, [image]);
  return (
    <section>
      <input
        type="file"
        onChange={(e) => {
          setImage(e.target.files?.[0] || null);
          e.target.value = "";
        }}
      />
    </section>
  );
}

export default App;
