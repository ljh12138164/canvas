// import { useEffect, useState } from "react";
// import type { App } from "api";
// import { hc } from "hono/client";

// const client = hc<App>("https://www.ljhboard.cn/").api.ai;

function App() {
  // const [image, setImage] = useState<File | null>(null);
  // useEffect(() => {
  //   async function readStreamed() {
  //     if (image) {
  //       const stream = await client.image.fileStream.$post({
  //         form: {
  //           image: image,
  //           // prompt: '',
  //         },
  //       });
  //       const reader = stream.body?.getReader();
  //       // 流式上下文
  //       function readStream() {
  //         reader?.read().then(({ done, value }) => {
  //           if (done) return;
  //           // 解密buffer类型为utf-8
  //           const text = new TextDecoder("utf-8").decode(value);
  //           readStream();
  //         });
  //       }
  //       readStream();
  //     }
  //   }
  //   readStreamed();
  // }, [image]);
  return (
    <section>
      {/* <input
        type="file"
        onChange={(e) => {
          setImage(e.target.files?.[0] || null);
          e.target.value = "";
        }}
      /> */}
    </section>
  );
}

export default App;
