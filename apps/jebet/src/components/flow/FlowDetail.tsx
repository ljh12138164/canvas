import { flowStore } from '@/store/flow';
// import { Workspace } from '@/types/workspace';
// import { UserResource } from '@clerk/types';
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from '@xyflow/react';
import { ArrowLeftIcon } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { Button } from '../ui/button';
import CustomEdge from './CustomEdge';

// interface FlowDetailProps {
//   workspaceId: string;
//   workspace: Workspace;
//   userData: UserResource;
// }
// { workspaceId, workspace, userData }: FlowDetailProps
const edgeTypes = {
  custom: CustomEdge,
};
export const FlowDetail = observer(() => {
  const { node, edges } = flowStore;
  const [nodes, , onNodeChange] = useNodesState(node);
  const [edge, , onEdgeChange] = useEdgesState(edges);
  return (
    <section className=" h-full">
      <header className=" h-[60px]">
        <div className=" flex items-center justify-between">
          <div className=" flex items-center gap-2">
            <h1 className=" text-2xl font-bold whitespace-nowrap">流程详情</h1>
          </div>
          <Button>
            <ArrowLeftIcon className=" w-4 h-4" />
            <span>返回</span>
          </Button>
        </div>
      </header>
      <div className=" h-[calc(100dvh-200px)]">
        <ReactFlow
          nodes={nodes}
          edges={edge}
          edgeTypes={edgeTypes}
          onNodesChange={onNodeChange}
          onEdgesChange={onEdgeChange}
        >
          {/* 背景 */}
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          {/* 控制 */}
          <Controls />
        </ReactFlow>
      </div>
    </section>
  );
});
