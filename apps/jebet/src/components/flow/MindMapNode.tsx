import { flowStore } from '@/store/flow';
import { Handle, type Node, type NodeProps, Position } from '@xyflow/react';
import { observer } from 'mobx-react-lite';

export type NodeData = {
  label: string;
};

const MindMapNode = observer(({ id, data }: NodeProps<Node<NodeData>>) => {
  return (
    <div className="px-2 py-1 shadow-md rounded-md bg-white border-2 border-stone-400">
      <div className="flex items-center">
        <div className="dragHandle cursor-move mr-1">
          <svg viewBox="0 0 24 24" width="16" height="16">
            <title>拖拽线条</title>
            <path
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1"
              d="M15 5h2V3h-2v2zM7 5h2V3H7v2zm8 8h2v-2h-2v2zm-8 0h2v-2H7v2zm8 8h2v-2h-2v2zm-8 0h2v-2H7v2z"
            />
          </svg>
        </div>
        <input
          value={data.label}
          onChange={(evt) => {
            flowStore.updateNodeLabel(id, evt.target.value);
          }}
          className="nodrag text-sm px-2 py-1 rounded bg-transparent outline-hidden border border-transparent hover:border-gray-200 focus:border-blue-500"
        />
      </div>
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-blue-500" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-blue-500" />
    </div>
  );
});

export default MindMapNode;
