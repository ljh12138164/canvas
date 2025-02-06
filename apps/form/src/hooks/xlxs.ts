// import { client } from '@/database';
// import { useMutation } from '@tanstack/vue-query';
// import type { InferRequestType, InferResponseType } from 'hono/client';

// type MySubmitFormResponse = InferResponseType<typeof client.xlxs.gender.$post>;
// type MySubmitFormRequset = InferRequestType<typeof client.xlxs.gender.$post>;
// export const exportXlxs = () => {
//   return useMutation<MySubmitFormResponse, Error, MySubmitFormRequset>({
//     mutationFn: async (datas) => {
//       const data = await client.xlxs.gender.$post(datas);
//       if (!data.ok) throw new Error(data.statusText);
//       const json = await data.json();
//       return json;
//     },
//   });
// };
