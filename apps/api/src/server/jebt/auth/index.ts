import { supabaseJebt } from "../../../server";

export const SignIn = async () => {
  const { data, error } = await supabaseJebt.from("user").select("*");
};
