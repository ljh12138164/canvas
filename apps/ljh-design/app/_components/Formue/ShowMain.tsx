import type { GetShowResponseType } from '@/app/_hook/query/useShow';

export function ShowMain({ showData }: { showData: GetShowResponseType }) {
  return <div>{showData.title}</div>;
}
