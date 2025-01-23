import type { GetShowResponseType } from '@/app/_hook/query/useShow';

export function ShowFooter({ showData }: { showData: GetShowResponseType }) {
  return <div>{showData.title}</div>;
}
