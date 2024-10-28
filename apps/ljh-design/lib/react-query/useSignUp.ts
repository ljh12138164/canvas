import { useMutation } from "@tanstack/react-query";
import { client } from "../api/hono";
import { InferRequestType, InferResponseType } from "hono";

//请求 响应类型
type ResonseType = InferResponseType<(typeof client.api.user)["$post"]>;
type RequestTtpe = InferRequestType<(typeof client.api.user)["$post"]>["json"];

export const useSignUp = () => {
  const {
    mutate: signUpMutate,
    isPending: signUpPending,
    isSuccess: signUpSuccess,
    isError: signUpError,
  } = useMutation<ResonseType, Error, RequestTtpe>({
    mutationFn: async (json) => {
      const res = await client.api.user.$post({ json });
      if (res.status === 400) throw new Error(JSON.stringify(res.json()));
      return res.json();
    },
  });
  return { signUpMutate, signUpPending, signUpSuccess, signUpError };
};
