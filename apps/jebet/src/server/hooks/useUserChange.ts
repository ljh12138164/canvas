// import { client } from '@/server/index';
// import { getNewToken } from '@/lib/sign';
// import { useMutation } from '@tanstack/react-query';
// import type { InferRequestType, InferResponseType } from 'hono/client';
// import { useNavigate } from 'react-router-dom';

// type UserChangeRequestType = InferRequestType<(typeof client.user.update)['$post']>;
// type UserChangeResponseType = InferResponseType<(typeof client.user.update)['$post']>;
// /**
//  * ### 用户信息修改
//  */
// export const useUserChange = () => {
//   const navigate = useNavigate();
//   const { mutate, isPending } = useMutation<UserChangeResponseType, Error, UserChangeRequestType>({
//     mutationFn: async (data) => {
//       const token = await getNewToken();
//       if (!token) navigate('/sign-in');
//       const response = await client.user.update.$post(data, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (!response.ok) {
//         const error = (await response.json()) as { message: string };
//         throw new Error(error.message);
//       }
//       return response.json();
//     },
//   });
//   return { mutate, isPending };
// };

// type UserChangePasswordRequestType = InferRequestType<(typeof client.user.password)['$post']>;
// type UserChangePasswordResponseType = InferResponseType<(typeof client.user.password)['$post']>;
// /**
//  * ### 修改用户密码
//  */
// export const useUserChangePassword = () => {
//   const navigate = useNavigate();
//   const { mutate: changePassword, isPending: changePasswordPending } = useMutation<
//     UserChangePasswordResponseType,
//     Error,
//     UserChangePasswordRequestType
//   >({
//     mutationFn: async (data) => {
//       const token = await getNewToken();
//       if (!token) navigate('/sign-in');
//       const response = await client.user.password.$post(data, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (!response.ok) {
//         throw new Error(response.statusText);
//       }
//       return response.json();
//     },
//   });
//   return { changePassword, changePasswordPending };
// };
