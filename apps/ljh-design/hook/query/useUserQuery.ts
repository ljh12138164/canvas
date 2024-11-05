import { client } from "@/api/hono";
import { getCurrentUser } from "@/api/supabase/sign";
import { User } from "@/types/user";
import { useMutation, useQuery } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
// 登录接口
type ResonseType = InferResponseType<
  (typeof client.api.user)["sign-in"]["$post"]
>;
type RequestTtpe = InferRequestType<
  (typeof client.api.user)["sign-in"]["$post"]
>["json"];
// 登录接口
type SignUpResponseType = InferResponseType<
  (typeof client.api.user)["sign-up"]["$post"]
>;
type SignUpRequestType = InferRequestType<
  (typeof client.api.user)["sign-up"]["$post"]
>["json"];
// 退出登录接口
type SignOutResponseType = InferResponseType<
  (typeof client.api.user)["sign-out"]["$post"]
>;
// 获取用户图片接口
type GetUserImageQuery = InferResponseType<
  (typeof client.api.image)["userImage"]["$post"]
>;
export const useUserQuery = (userId: string) => {
  const { data, isLoading, error } = useQuery<User | undefined, Error>({
    queryKey: ["user"],
    queryFn: () => getCurrentUser({ userId }),
  });
  return { data, isLoading, error };
};

/**
 * 登录
 * @returns
 */
export const useSignIn = () => {
  const {
    mutate: signInMutate,
    isPending: signInPending,
    error: signInError,
  } = useMutation<ResonseType, Error, RequestTtpe>({
    mutationFn: async (data) => {
      const res = await client.api.user["sign-in"].$post({ json: data });
      if (res.status === 400) throw new Error("账号或密码错误");
      const json = await res.json();
      return json;
    },
  });
  return { signInMutate, signInPending, signInError };
};
/**
 * 注册
 * @returns
 */
export const useSignUp = () => {
  const {
    mutate: signUpMutate,
    isPending: signUpPending,
    error: signUpError,
  } = useMutation<SignUpResponseType, Error, SignUpRequestType>({
    mutationFn: async (data) => {
      const res = await client.api.user["sign-up"].$post({ json: data });
      if (res.status === 400) throw new Error("账号已存在");
      const json = await res.json();
      return json;
    },
  });
  return { signUpMutate, signUpPending, signUpError };
};
/**
 * 退出登录
 * @returns
 */
export const useSignOut = () => {
  const {
    mutate: signOutMutate,
    isPending: signOutPending,
    error: signOutError,
  } = useMutation<SignOutResponseType, Error>({
    mutationFn: async () => {
      const res = await client.api.user["sign-out"].$post();

      const json = await res.json();
      return json;
    },
  });
  return { signOutMutate, signOutPending, signOutError };
};
/**
 * 获取用户图片
 * @returns
 */
export const useGetUserImage = (userId: string) => {
  const { data, isLoading, error } = useQuery<GetUserImageQuery, Error>({
    queryKey: ["userImage", userId],
    queryFn: async () => {
      const res = await client.api.image["userImage"].$post({
        json: { userId },
      });
      if (res.status === 400) throw new Error("获取图片失败");
      const json = await res.json();
      return json;
    },
  });
  return { data, isLoading, error };
};
