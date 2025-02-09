'use client';
import { getTryBoardById, indexDBChange } from '@/app/_lib/utils';
import type { Board } from '@/app/_types/board';
import { useEffect, useState } from 'react';
import TrtCanvas from './TryCanvasa';

const TryEdit = ({ id }: { id?: string }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Board>();
  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await getTryBoardById(id!);
      if (!data) {
        await indexDBChange({ type: 'delete', deletItem: id! });
        await indexDBChange({
          type: 'add',
          data: {
            id: id!,
            name: '试用',
            json: '',
            width: 1000,
            height: 1000,
          },
        });
      }
      const newDate = (await getTryBoardById(id!)) as Board;
      setLoading(false);
      setData(newDate);
    })();
  }, [id]);
  if (loading) return <></>;
  return <TrtCanvas data={data} />;
};

export default TryEdit;
