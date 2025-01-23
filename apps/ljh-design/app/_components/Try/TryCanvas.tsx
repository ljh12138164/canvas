'use client';
import { useTryStore } from '@/app/_hook/edior/useTryData';
import { redirect } from 'next/navigation';
import toast from 'react-hot-toast';
import TryEdit from '../EditComponents/editor/TryEdit';
const TryCanvas = ({ id }: { id: string }) => {
  const { data, isLoading } = useTryStore({ id });
  if (isLoading) return <></>;
  if (!data) {
    toast.dismiss();
    toast.error('未找到面板数据');
    redirect('/try/board');
  }
  return <TryEdit data={data} id={id} />;
};

export default TryCanvas;
