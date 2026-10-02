interface CSVTask {
  title: string;
  description: string;
  category: string;
  priority: string;
  startDate: string;
  dueDate: string;
  status: string;
}

interface ValidationResult {
  validTasks: CSVTask[];
  errors: string[];
}
