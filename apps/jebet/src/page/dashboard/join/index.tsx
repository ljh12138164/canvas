import JoinWorkspaceCard from '@/components/board/JoinWorkspaceCard';
import useStore from '@/store/user';
import { observer } from 'mobx-react-lite';
import { useNavigate, useParams } from 'react-router-dom';
// @ts-ignore
const Join = observer(() => {
  const { userData } = useStore;
  const navigate = useNavigate();
  const { id } = useParams();
  if (userData == null) return null;
  if (id?.length !== 6) return navigate('/');

  return <JoinWorkspaceCard id={id} user={userData} />;
});
export default Join;
