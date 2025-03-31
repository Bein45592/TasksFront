import { Routes } from "@angular/router";
import { TaskComponent } from "./components/task/task.component";
import { TasksComponent } from "./components/tasks/tasks.component";

export const routes: Routes = [
  {
    path: "",
    component: TasksComponent,
  },
];
