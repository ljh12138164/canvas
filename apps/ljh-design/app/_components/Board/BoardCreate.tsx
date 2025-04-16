'use client';
import type { Board } from '@/app/_types/board';

import { FaStar } from 'react-icons/fa6';
import ColorCard from '../Comand/ColorCard';
import CreateForm from './CreateForm';

const BoardCreate = ({
  setChange,
  data,
  userId,
}: {
  setChange?: (change: boolean) => void;
  data: Board[];
  userId?: string;
}) => {
  return (
    <section className="p-2 h-[200px]  w-full">
      <ColorCard
        title="创建你的画布以开始使用"
        icon={<FaStar className="text-yellow-500 text-[2rem] animate-pulse hover:animate-spin" />}
        className="bg-linear-to-r from-blue-700 to-blue-300 border-none shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <CreateForm userId={userId} setChange={setChange} />
      </ColorCard>
    </section>
  );
};

export default BoardCreate;
