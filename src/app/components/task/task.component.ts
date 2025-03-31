import { CommonModule } from "@angular/common";
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Subject, takeUntil } from "rxjs";
import { PriorityOptions, StatusOptions } from "src/app/model/options";
import { Itask } from "src/app/model/task";
import { TasksService } from "src/app/services/tasks.service";

@Component({
  selector: "app-task",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./task.component.html",
  styleUrl: "./task.component.scss",
})
export class TaskComponent implements OnInit, OnDestroy {
  taskGroup!: FormGroup;
  priorityOptions = PriorityOptions;
  statusOptions = StatusOptions;
  @Input() taskToEdit!: Itask | undefined;
  @Output() closePopup = new EventEmitter<null>();

  private destroyed$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private tasksService: TasksService,
  ) {}

  ngOnInit(): void {
    this.createForm();
    if (this.taskToEdit) {
      this.taskGroup.patchValue(this.taskToEdit); // Populate form with task data
    }
  }

  createForm(): void {
    this.taskGroup = this.fb.group({
      title: ["", Validators.required],
      description: [""],
      priority: [0],
      deadLine: ["", Validators.required],
      status: [0],
    });
  }
  addTask(): void {
    if (this.taskGroup.valid) {
      if (this.taskGroup.valid) {
        const newTask: Itask = this.taskGroup.value;
        this.tasksService.addTasks(newTask).subscribe({
          next: (addedTask) => {
            console.log("Task added successfully:", addedTask);
            this.taskGroup.reset();
            this.tasksService.loadTasks();
            this.closePopup.emit();
          },
          error: (err) => {
            console.error("There was an error adding the task:", err);
          },
        });
      } else {
        console.log("Form is invalid");
      }
    } else {
      console.log("Form is invalid");
    }
  }
  editTask(): void {
    if (this.taskToEdit) {
      const task: Itask = this.taskGroup.value;
      this.tasksService
        .editTasks(this.taskToEdit.id, task)
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: () => {
            // Update the local tasks array with the updated task
            this.tasksService.loadTasks();
            this.closePopup.emit();
          },
          error: (error) => {
            console.error("Error updating task", error);
          },
        });
    }
  }
  onSubmit(): void {
    if (this.taskToEdit) {
      this.editTask();
    } else {
      this.addTask();
    }
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
