export interface Workspace {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  imageUrl: string;
  inviteCode: string;
}

export interface Member {
  id: string;
  userId: string;
  workspaceId: string;
  role: 'admin' | 'member';
  email: string;
  userImage: string;
  username: string;
  created_at: string;
}

// 工作区成员
export interface WorkspaceWithMember extends Workspace {
  userId: string;
  role: 'admin' | 'member';
}

export interface Project {
  created_at: string;
  updated_at: string;
  id: string;
  userId: string;
  name: string;
  workspaceId: string;
  imageUrl: string;
}
// 任务状态
export enum TaskStatus {
  ALL = '全部',
  BACKLOG = '储备',
  TODO = '待办',
  DONE = '完成',
  IN_PROGRESS = '进行中',
  IN_REVIEW = '等待审核',
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
