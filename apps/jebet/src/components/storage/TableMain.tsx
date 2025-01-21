import { useStoages } from '@/server/hooks/stoages';
import type { Member, Workspace } from '@/types/workspace';
import { DataTable } from './Table';
import { columns } from './data';

interface TableMainProps {
  workspace: Workspace & { member: Member[] };
  userId: string;
}
const TableMain = ({ workspace, userId }: TableMainProps) => {
  const { stoages, stoagesLoading, error } = useStoages(workspace.id, userId);
  return (
    <section>
      {stoagesLoading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {stoages && <DataTable columns={columns} data={stoages} />}
    </section>
  );
};

export default TableMain;
