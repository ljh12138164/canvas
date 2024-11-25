import userStore from '@/store/user';
const Setting = () => {
  const { userData } = userStore;
  if (!userData) return null;
  return <div>11</div>;
};

export default Setting;
