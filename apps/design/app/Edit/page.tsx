import { protectServer } from "@/lib/utils";
import Edit from "@/app/_components/EditComponents/edit";
export default async function Home() {
  const session = await protectServer();

  return <Edit session={session} />;
}
