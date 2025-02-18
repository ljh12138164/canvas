import { AutoForm } from '@autoform/ant';
import { ZodProvider } from '@autoform/zod';
// import { useEffect, useState } from "react";
// import type { App } from "api";
// import { hc } from "hono/client";
import { z } from 'zod';
enum Sports {
  Football = 'Football/Soccer',
  Basketball = 'Basketball',
  Baseball = 'Baseball',
  Hockey = 'Hockey (Ice)',
  None = "I don't like sports",
}

// const client = hc<App>("https://www.ljhboard.cn/").api.ai;
const zodSchemaProvider = new ZodProvider(
  z.object({
    password: z
      .string({
        required_error: 'Password is required.',
      })
      .describe('Your secure password')
      .min(8, {
        message: 'Password must be at least 8 characters.',
      }),
    favouriteNumber: z.coerce
      .number({
        invalid_type_error: 'Favourite number must be a number.',
      })
      .min(1, {
        message: 'Favourite number must be at least 1.',
      })
      .max(10, {
        message: 'Favourite number must be at most 10.',
      })
      .default(1)
      .optional(),
    acceptTerms: z
      .boolean()
      .describe('Accept terms and conditions.')
      .refine((value) => value, {
        message: 'You must accept the terms and conditions.',
        path: ['acceptTerms'],
      }),
    sendMeMails: z.boolean().optional(),
    birthday: z.coerce.date({ message: 'aaa' }).optional(),
    color: z.enum(['red', 'green', 'blue']).optional(),
    // Another enum example
    marshmallows: z
      .enum(['not many', 'a few', 'a lot', 'too many'])
      .describe('How many marshmallows fit in your mouth?'),
    // Native enum example
    sports: z.nativeEnum(Sports).describe('What is your favourite sport?'),
  }),
);
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
      <AutoForm
        onSubmit={() => {
          // console.log(data);
        }}
        schema={zodSchemaProvider}
      >
        <button type="submit">提交</button>
      </AutoForm>
    </section>
  );
}

export default App;
