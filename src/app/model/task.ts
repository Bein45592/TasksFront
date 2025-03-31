export interface Itask {
  id: number;
  title: string;
  description?: string;
  priority: EPriority;
  deadLine: string;
  status: EStatus;
}

// priority options
export enum EPriority {
  Low = 1,
  Regular = 2,
  High = 3,
}

// status options
export enum EStatus {
  Wait = 1,
  InProgress = 2,
  Completed = 3,
}
