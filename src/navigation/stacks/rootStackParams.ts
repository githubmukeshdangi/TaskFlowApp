export type RootStackParams = {
  bottomTab: undefined;
  addEditTask: { taskId?: string } | undefined;
  taskDetails: { taskId: string };
  bulkUpload: undefined;
  taskList: undefined;
};

export type BottomTabParams = {
  dashboard: undefined;
  taskList: undefined;
  settings: undefined;
};