import { EPriority, EStatus } from "./task";

export const PriorityOptions: { name: string; id: EPriority }[] = [
  { name: "נמוכה", id: EPriority.Low },
  { name: "בינונית", id: EPriority.Regular },
  { name: "גבוהה", id: EPriority.High },
];

export const StatusOptions: { name: string; id: EStatus }[] = [
  { name: "ממתינה", id: EStatus.Wait },
  { name: "בתהליך", id: EStatus.InProgress },
  { name: "הושלמה", id: EStatus.Completed },
];
