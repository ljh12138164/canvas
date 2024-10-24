import { supabase } from "@/database/supbash";
import { hashSync } from "bcryptjs";

interface User {
  name: string;
  account: string;
  password?: string;
}
export const createUser = async (user: User) => {
  if (user.password) user.password = hashSync(user.password, 10);
  const { data, error } = await supabase.from("user").insert([user]);
  if (error) {
    throw new Error(error.message);
  }
  return data;
};
export const getUser = async (account: string) => {
  const { data, error } = await supabase
    .from("user")
    .select("*")
    .eq("account", account);
  if (error) {
    throw new Error(error.message);
  }
  return data;
};
