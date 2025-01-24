import type { GetShowResponseType } from '@/app/_hook/query/useShow';
import { Render } from './Render';

// 帖子主体
export function ShowMain({ showData }: { showData: GetShowResponseType }) {
  return (
    <div className="flex flex-col gap-4 min-h-[300px]">
      <Render content={showData.explanation} />
    </div>
  );
}
