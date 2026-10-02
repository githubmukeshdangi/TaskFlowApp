
export type TaskPriority = string;

export type TaskStatus = string;

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: TaskPriority;
  startDate: string;
  dueDate: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}