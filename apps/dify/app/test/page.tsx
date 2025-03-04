'use client';
import * as rechart from 'recharts';
import * as uiComponetns from '../../components/ui';
import { useTranform } from '../_hooks/useTranform';
import { Codes } from '../_lib';

const Page = () => {
  const renderedComponent = useTranform({ ...uiComponetns, ...rechart }, Codes);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h2 className="text-2xl font-semibold mb-4">执行结果:</h2>

      <div className="bg-[#121212] rounded-lg p-4 shadow-lg">{renderedComponent}</div>
    </div>
  );
};

export default Page;
