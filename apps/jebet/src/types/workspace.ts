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
  role: 'admin' | 'member';
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
  ALL = '全部',
  BACKLOG = '储备',
  IN_REVIEW = '等待审核',
  TODO = '待办',
  IN_PROGRESS = '进行中',
  DONE = '完成',
}

// 任务优先级
export enum TasksPriority {
  ALL = '全部',
  SUGGESTION = '建议',
  GENERAL = '一般',
  IMPORTANT = '重要',
  URGENT = '紧急',
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
  priority: TasksPriority;
}
// 任务包含工作区信息
export interface TaskWithWorkspace extends Task {
  workspace: Workspace & { member: Member[] };
  project: Project;
}

// 文件数据
export interface StoageData {
  id: string;
  name: string;
  description: string;
  file: string;
  type: string;
  size: number;
  isTrash: Date | null;
  workspaceId: string;
  created_at: string;
  updated_at: string;
}

export interface Flow {
  id: string;
  name: string;
  description: string;
  workspaceId: string;
  userId: string;
}
