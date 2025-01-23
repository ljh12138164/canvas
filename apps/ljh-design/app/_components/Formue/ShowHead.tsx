import type { GetShowResponseType } from '@/app/_hook/query/useShow';

export function ShowHead({ showData }: { showData: GetShowResponseType }) {
  return <div>{showData.title}</div>;
}
