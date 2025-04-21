'use client';
import type { GetShowResponseType } from '@/app/_hook/query/useShow';
import ReactQuill from '../Comand/editor/quill';

export function ShowFooter({
  showData,
  ref,
}: { showData: GetShowResponseType; ref: React.RefObject<HTMLDivElement | null> }) {
  return (
    <div ref={ref}>
      <ReactQuill showData={showData} />
    </div>
  );
}
