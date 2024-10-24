import { supabase } from "@/database/supbash";
import { v4 as uuidv4 } from "uuid";
// 创建用户表
interface CreateUsersTableProps {
  name: string;
  email: string;
  password: string;
}
export async function createUsersTable({
  name,
  email,
  password,
}: CreateUsersTableProps) {
  const { data, error } = await supabase
    .schema("next_auth")
    .from("users")
    .insert([
      {
        id: uuidv4(),
        name,
        email,
        password,
        image:
          "https://osdawghfaoyysblfsexp.supabase.co/storage/v1/object/public/ljh-design-ui/CarbonUserAvatarFilled.png",
      },
    ])
    .select("name,id,eamil");
  console.log(data, error);
  if (error) throw new Error("Error creating users table:" + error.message);
  return data;
}

// 创建会话表
export async function createSessionsTable() {
  const { data, error } = await supabase.from("sessions").insert([
    {
      id: uuidv4(),
      expires: new Date().getTime(),
      sessionToken: "",
      userId: null,
    },
  ]);
  if (error) throw new Error("Error creating sessions table:" + error.message);
  return data;
}

// 创建账户表
export async function createAccountsTable() {
  const { data, error } = await supabase
    .schema("next_auth")
    .from("accounts")
    .insert([
      {
        id: uuidv4(),
        type: "",
        provider: "",
        providerAccountId: "",
        refresh_token: null,
        access_token: null,
        expires_at: null,
        token_type: null,
        scope: null,
        id_token: null,
        session_state: null,
        oauth_token_secret: null,
        oauth_token: null,
        userId: null,
      },
    ]);
  if (error) throw new Error("Error creating accounts table:" + error.message);
  return data;
}

// 创建验证令牌表
export async function createVerificationTokensTable() {
  const { data, error } = await supabase
    .schema("next_auth")
    .from("verification_tokens")
    .insert([
      {
        identifier: "",
        token: "",
        expires: new Date(),
      },
    ]);
  if (error)
    throw new Error(
      "Error creating verification_tokens table:" + error.message
    );
  return data;
}
