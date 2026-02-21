// This matches what comes from the C# API
// By default, ASP.NET Core serializes to camelCase
export interface TaskDTO {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: string; // DateTime comes as ISO string from API
  completedAt: string | null; // DateTime? comes as ISO string or null
}

// Optional: Local model with Date objects for easier manipulation
export interface Task {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  createdAt: Date;
  completedAt: Date | null;
}

// Helper to convert API response to local model
export function taskFromDTO(dto: TaskDTO): Task {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    isCompleted: dto.isCompleted,
    createdAt: new Date(dto.createdAt),
    completedAt: dto.completedAt ? new Date(dto.completedAt) : null,
  };
}

// Helper to convert local model to API request
export function taskToDTO(task: Task): TaskDTO {
  return {
    id: task.id,
    title: task.title,
    description: task.description,
    isCompleted: task.isCompleted,
    createdAt: task.createdAt.toISOString(),
    completedAt: task.completedAt ? task.completedAt.toISOString() : null,
  };
}
