import { supabase } from "@/database/supbash";
import { User } from "@/types/user";
import { compareSync } from "bcryptjs";

interface SignUpUser {
  name: string;
  account: string;
  password?: string;
  image?: string;
}
// 创建用户
export const createUser = async (user: SignUpUser): Promise<User | null> => {
  if (!user.image)
    user.image =
      "https://osdawghfaoyysblfsexp.supabase.co/storage/v1/object/public/ljh-design-ui/CarbonUserAvatarFilled.png";
  const { data, error } = await supabase
    .from("user")
    .insert([user])
    .select("id, name, account, image ,created_at")
    .single();
  if (error?.message) {
    throw new Error(error.message);
  }
  if (!data) {
    throw new Error("出错");
  }
  return data;
};

export async function getCurrentUser({
  userId ,
}: {
  userId: string;
}): Promise<User | undefined> {
  const { data, error } = await supabase
    .from("user")
    .select("id, name, account, image ,created_at")
    .eq("id", userId)
    .single();
  if (error?.message) {
    throw new Error(error.message);
  }
  if (!data) {
    throw new Error("出错");
  }
  return data;
}
// 登录
interface SignInUser {
  account: string;
  password: string;
}
export const signIn = async ({
  account,
  password,
}: SignInUser): Promise<User | null> => {
  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("account", account);
  if (error?.message || !data) {
    throw new Error("账号或密码错误");
  }
  if (data?.length === 0) {
    throw new Error("未找到用户");
  }
  const comparePassword = compareSync(password, data[0].password);
  if (!comparePassword) {
    throw new Error("账号或密码错误");
  }
  return {
    id: data[0].id,
    name: data[0].name,
    account: data[0].account,
    image: data[0].image,
    created_at: data[0].created_at,
  };
};
