import { makeObservable, observable, action, runInAction } from "mobx";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  XYPosition,
} from "@xyflow/react";
import { nanoid } from "nanoid";

class FlowStore {
  node: Node[] = [
    {
      id: "root",
      type: "mindmap",
      data: { label: "思维导图" },
      position: { x: 250, y: 25 },
      dragHandle: ".dragHandle",
    },
  ];
  edges: Edge[] = [];

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
      type: "mindmap",
      data: { label: "新节点" },
      position: {
        x: position.x,
        y: position.y + 50,
      },
      dragHandle: ".dragHandle",
    };

    const newEdge = {
      id: nanoid(),
      source: parentNode.id,
      target: newNode.id,
      type: "mindmap",
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
