import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subject, takeUntil } from "rxjs";
import { PriorityOptions, StatusOptions } from "src/app/model/options";
import { Itask } from "src/app/model/task";
import { TasksService } from "src/app/services/tasks.service";
import { TaskComponent } from "../task/task.component";

@Component({
  selector: "app-tasks",
  standalone: true,
  imports: [CommonModule, TaskComponent],
  templateUrl: "./tasks.component.html",
  styleUrl: "./tasks.component.scss",
})
export class TasksComponent implements OnInit, OnDestroy {
  tasks!: Itask[];
  priorityOptions = PriorityOptions;
  statusOptions = StatusOptions;
  popupEnable: boolean = false;
  selectedTask?: Itask;
  private destroyed$ = new Subject<void>();

  constructor(private taskservice: TasksService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks() {
    this.taskservice.tasksData$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        if (data) {
          this.tasks = data;
          console.log(this.tasks);
        }
      });
  }
  deleteTask(taskIndex: number): void {
    const task: Itask = this.tasks[taskIndex];
    if (task && task.id) {
      this.taskservice.deleteTasks(task.id).subscribe(() => {
        this.taskservice.loadTasks();
      });
    }
  }

  toggleModal(task?: Itask): void {
    this.popupEnable = !this.popupEnable;
    if (task) {
      this.selectedTask = task; // Set the selected task for editing
    } else {
      this.selectedTask = undefined; // Reset for adding new task
    }
  }
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
