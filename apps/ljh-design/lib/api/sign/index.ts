import { supabase } from "@/database/supbash";
import { hashSync } from "bcryptjs";
import { User } from "@/types/user";

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
  if (user.password) user.password = hashSync(user.password, 10);
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

export async function getCurrentUser() {
  return false;
}
