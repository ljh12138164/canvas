// import { supabaseDesign } from "../../supabase/design";
// import { User } from "../../../types/design/user";
// import md5 from "blueimp-md5";

// interface SignUpUser {
//   name: string;
//   account: string;
//   password?: string;
//   image?: string;
// }
// // 创建用户
// export const createUser = async (user: SignUpUser): Promise<User | null> => {
//   if (!user.image)
//     user.image =
//       "https://osdawghfaoyysblfsexp.supabase.co/storage/v1/object/public/ljh-design-ui/CarbonUserAvatarFilled.png";
//   const { data, error } = await supabaseDesign
//     .from("user")
//     .insert([user])
//     .select("id, name, account, image ,created_at")
//     .single();
//   if (error?.message) {
//     throw new Error(error.message);
//   }
//   if (!data) {
//     throw new Error("出错");
//   }
//   return data;
// };

// export async function getCurrentUser({
//   userId,
// }: {
//   userId: string;
// }): Promise<User | undefined> {
//   const { data, error } = await supabaseDesign
//     .from("user")
//     .select("id, name, account, image ,created_at")
//     .eq("id", userId)
//     .single();
//   if (error?.message) {
//     throw new Error(error.message);
//   }
//   if (!data) {
//     throw new Error("出错");
//   }
//   return data;
// }
// // 登录
// interface SignInUser {
//   account: string;
//   password: string;
// }
// export const signIn = async ({
//   account,
//   password,
// }: SignInUser): Promise<User | null> => {
//   const { data, error } = await supabaseDesign
//     .from("user")
//     .select("*")
//     .eq("account", account);
//   if (error?.message || !data) {
//     throw new Error("账号或密码错误");
//   }
//   if (data?.length === 0) {
//     throw new Error("未找到用户");
//   }
//   const comparePassword = md5(password);
//   if (comparePassword !== data[0].password) {
//     throw new Error("账号或密码错误");
//   }
//   return {
//     id: data[0].id,
//     name: data[0].name,
//     account: data[0].account,
//     image: data[0].image,
//     created_at: data[0].created_at,
//   };
// };
