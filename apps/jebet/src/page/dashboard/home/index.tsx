import { observer } from 'mobx-react-lite';
import useStore from '@/store/user';
import JoinCard from '@/components/board/JoinCard';

const Home = observer(() => {
  const { userData } = useStore;
  if (userData == null) return null;
  return (
    <div>
      <JoinCard />
    </div>
  );
});

export default Home;
