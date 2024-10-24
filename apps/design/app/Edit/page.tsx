import Edit from "@/app/_components/EditComponents/edit";
import { checkSession } from "@/lib/api/image";
export default async function Home() {
  const session = await checkSession();
  console.log(session);
  return <Edit />;
}
