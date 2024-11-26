export interface Workspace {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  imageUrl: string;
  inviteCode: string;
}

export interface Member {
  created_at: string;
  id: string;
  userId: string;
  workspaceId: string;
  role: "admin" | "member";
  email: string;
  userImage: string;
  username: string;
}

export interface Project {
  created_at: string;
  updated_at: string;
  id: string;
  name: string;
  workspaceId: string;
  imageUrl: string;
}
// 任务状态
export enum TaskStatus {
  ALL = "全部",
  BACKLOG = "储备",
  TODO = "待办",
  DONE = "完成",
  IN_PROGRESS = "进行中",
  IN_REVIEW = "等待审核",
}
export interface Task {
  id: string;
  name: string;
  projectId: string;
  workspaceId: string;
  created_at: string;
  updated_at: string;
  lastTime: string;
  status: TaskStatus;
  description: string;
  assigneeId: string;
}
