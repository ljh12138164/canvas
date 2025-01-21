import { useFlow } from '@/server/hooks/flow';
import type { Member, Workspace } from '@/types/workspace';
import { DataTable } from './Table';
import { columns } from './data';

interface TableMainProps {
  workspace: Workspace & { member: Member[] };
  userId: string;
}
const TableMain = ({ workspace, userId }: TableMainProps) => {
  const { flows, flowsLoading, error } = useFlow(workspace.id, userId);
  return (
    <section>
      {flowsLoading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {flows && <DataTable columns={columns} data={flows} />}
    </section>
  );
};

export default TableMain;
