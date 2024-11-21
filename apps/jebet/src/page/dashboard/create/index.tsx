import FromCard from "@/components/board/FromCard";
import { Card } from "@/components/ui/card";
import userStore from "@/store/user";
import { observer } from "mobx-react-lite";
const Creat = observer(() => {
  const { userData } = userStore;

  if (!userData) return null;

  return (
    <Card>
      <FromCard userData={userData} />
    </Card>
  );
});

export default Creat;
