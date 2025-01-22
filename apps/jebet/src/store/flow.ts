import {
  type Connection,
  type Edge,
  type EdgeChange,
  MarkerType,
  type Node,
  type NodeChange,
  type XYPosition,
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
} from '@xyflow/react';
import { action, makeObservable, observable, runInAction } from 'mobx';
import { nanoid } from 'nanoid';

/**
 * ### 流程图
 *
 */
class FlowStore {
  /**
   * 节点
   */
  node: Node[] = [
    {
      id: '1',
      data: { label: '开始' },
      position: { x: 0, y: 0 },
    },
    {
      id: '2',
      data: { label: '结束' },
      position: { x: 100, y: 200 },
    },
  ];
  /**
   * 边
   */
  edges: Edge[] = [
    {
      id: '1-2',
      source: '1',
      target: '2',
      type: 'custom',
      // 添加箭头
      markerEnd: {
        type: MarkerType.Arrow,
      },
    },
  ];

  constructor() {
    makeObservable(this, {
      node: observable,
      edges: observable,
      onNodesChange: action,
      onEdgesChange: action,
      onConnect: action,
      addNode: action,
      addEdge: action,
    });
  }

  // 更新节点
  onNodesChange = (changes: NodeChange[]) => {
    runInAction(() => {
      this.node = applyNodeChanges(changes, this.node);
    });
  };
  // 更新边
  onEdgesChange = (changes: EdgeChange[]) => {
    runInAction(() => {
      this.edges = applyEdgeChanges(changes, this.edges);
    });
  };
  // 添加边
  onConnect = (connection: Connection) => {
    runInAction(() => {
      this.edges = addEdge(connection, this.edges);
    });
  };

  // 添加节点
  addNode = (node: Node) => {
    runInAction(() => {
      this.node.push(node);
    });
  };
  // 添加边
  addEdge = (edge: Edge) => {
    runInAction(() => {
      this.edges.push(edge);
    });
  };

  addChildNode = (parentNode: Node, position: XYPosition) => {
    const newNode = {
      id: nanoid(),
      type: 'mindmap',
      data: { label: '新节点' },
      position: {
        x: position.x,
        y: position.y + 50,
      },
      dragHandle: '.dragHandle',
    };

    const newEdge = {
      id: nanoid(),
      source: parentNode.id,
      target: newNode.id,
      type: 'mindmap',
      animated: true,
    };

    runInAction(() => {
      this.node.push(newNode);
      this.edges.push(newEdge);
    });
  };
  // 更新节点标签
  updateNodeLabel = (nodeId: string, label: string) => {
    runInAction(() => {
      const nodeIndex = this.node.findIndex((node) => node.id === nodeId);
      if (nodeIndex !== -1) {
        const updatedNode = {
          ...this.node[nodeIndex],
          data: { ...this.node[nodeIndex].data, label },
        };
        this.node[nodeIndex] = updatedNode;
      }
    });
  };
}

export const flowStore = new FlowStore();
