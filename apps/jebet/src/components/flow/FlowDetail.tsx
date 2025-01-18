import { flowStore } from "@/store/flow";
import { Workspace } from "@/types/workspace";
import { UserResource } from "@clerk/types";
import {
  Background,
  BackgroundVariant,
  BuiltInNode,
  ConnectionLineType,
  Controls,
  MiniMap,
  NodeOrigin,
  OnConnectEnd,
  OnConnectStart,
  ReactFlow,
  useReactFlow,
  useStoreApi,
  // Node, // 添加 Node 类型导入
} from "@xyflow/react";
import { useMemoizedFn } from "ahooks";
import { ArrowLeftIcon } from "lucide-react";
import { observer } from "mobx-react-lite";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import MindMapEdge from "./MindMapEdge";
import MindMapNode from "./MindMapNode";

interface FlowDetailProps {
  workspaceId: string;
  workspace: Workspace;
  userData: UserResource;
}

const nodeColor = (node: BuiltInNode) => {
  switch (node.type) {
    case "input":
      return "#6ede87";
    case "output":
      return "#6865A5";
    default:
      return "#ff0072";
  }
};
const nodeOrigin: NodeOrigin = [0.5, 0.5];
const nodeTypes = {
  mindmap: MindMapNode,
};

const edgeTypes = {
  mindmap: MindMapEdge,
};
// TODO: REACT FLOW
export const FlowDetail = observer(
  ({ workspaceId, workspace, userData }: FlowDetailProps) => {
    // const reactFlowInstance = useReactFlow();
    console.log(workspaceId, workspace, userData);
    const [variant, setVariant] = useState<BackgroundVariant>(
      (localStorage.getItem("variant") as BackgroundVariant) ||
        BackgroundVariant.Cross
    );
    // const [edges, setEdges] = useState(initialEdges);
    const { screenToFlowPosition } = useReactFlow();
    const store = useStoreApi();
    const connectingNodeId = useRef<string | null>(null);
    // 连接开始
    const onConnectStart: OnConnectStart = useMemoizedFn((_, { nodeId }) => {
      connectingNodeId.current = nodeId;
    });
    // 连接结束
    const onConnectEnd: OnConnectEnd = useMemoizedFn((event) => {
      const { nodeLookup } = store.getState();
      const targetIsPane = (event.target as Element).classList.contains(
        "react-flow__pane"
      );

      if (!targetIsPane || !connectingNodeId.current) return;

      const parentNode = nodeLookup.get(connectingNodeId.current);
      if (!parentNode) return;

      const position = getChildNodePosition(event);
      flowStore.addChildNode(parentNode, position);
    });

    const getChildNodePosition = (
      event: MouseEvent | TouchEvent
      // parentNode: Node
    ) => {
      const panePosition = screenToFlowPosition({
        x: "touches" in event ? event.touches[0].clientX : event.clientX,
        y: "touches" in event ? event.touches[0].clientY : event.clientY,
      });

      return {
        x: panePosition.x,
        y: panePosition.y,
      };
    };

    return (
      <section className=" h-full">
        <header className=" h-[60px]">
          <div className=" flex items-center justify-between">
            <div className=" flex items-center gap-2">
              <h1 className=" text-2xl font-bold whitespace-nowrap">
                流程详情
              </h1>
              <select
                value={variant}
                onChange={(e) => {
                  setVariant(e.target.value as BackgroundVariant);
                  localStorage.setItem("variant", e.target.value);
                }}
              >
                <option value={BackgroundVariant.Cross}>交叉</option>
                <option value={BackgroundVariant.Dots}>点</option>
                <option value={BackgroundVariant.Lines}>线</option>
              </select>
            </div>
            <Button>
              <ArrowLeftIcon className=" w-4 h-4" />
              <span>返回</span>
            </Button>
          </div>
        </header>
        <div className=" h-[calc(100dvh-200px)]">
          <ReactFlow
            nodes={flowStore.node}
            edges={flowStore.edges}
            fitView
            panOnScroll
            selectionOnDrag
            onNodesChange={flowStore.onNodesChange}
            onEdgesChange={flowStore.onEdgesChange}
            onConnect={flowStore.onConnect}
            connectionLineType={ConnectionLineType.Straight}
            onConnectStart={onConnectStart}
            onConnectEnd={onConnectEnd}
            defaultEdgeOptions={{ animated: true }}
            nodeOrigin={nodeOrigin}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            maxZoom={2}
            minZoom={0.5}
            snapToGrid={true}
            snapGrid={[15, 15]}
            elevateNodesOnSelect={true}
            nodesDraggable={true}
            proOptions={{ hideAttribution: true }}
            deleteKeyCode={["Backspace", "Delete"]}
            multiSelectionKeyCode={["Control", "Meta"]}
            selectionKeyCode={["Shift"]}
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          >
            <Background variant={variant} gap={15} />
            <Controls />
            <MiniMap
              nodeColor={nodeColor}
              nodeStrokeWidth={3}
              zoomable
              pannable
            />
          </ReactFlow>
        </div>
      </section>
    );
  }
);
