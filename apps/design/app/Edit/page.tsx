import { protectServer } from "@/lib/utils";
import Edit from "@/app/_components/EditComponents/edit";
import { SessionSupabase } from "@/database/supbash";
export default async function Home() {
  const session = (await protectServer()) as SessionSupabase;
  console.log(session);
  return <Edit session={session} />;
}
