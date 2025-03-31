import { HttpClient } from "@angular/common/http";
import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, Observable, Subject, takeUntil } from "rxjs";
import { Itask } from "../model/task";
import { environment } from "src/environments/environments";

@Injectable({
  providedIn: "root",
})
export class TasksService implements OnDestroy {
  private apiRoutes = "api/Tasks";

  // Initialize with either a default task object or null (if you change the BehaviorSubject type)
  private tasksDataSubject: BehaviorSubject<Itask[] | null> =
    new BehaviorSubject<Itask[] | null>(null);
  public tasksData$: Observable<Itask[] | null> =
    this.tasksDataSubject.asObservable();
  private destroyed$ = new Subject<void>();

  constructor(private http: HttpClient) {
    this.loadTasks();
  }

  public loadTasks(): void {
    const url = `${environment.apiBaseUrl}${this.apiRoutes}`;
    this.http
      .get<Itask[]>(url)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.tasksDataSubject.next(data);
      });
  }
  public addTasks(taskData: Itask): Observable<Itask> {
    const url = `${environment.apiBaseUrl}${this.apiRoutes}`;
    return this.http.post<Itask>(url, taskData);
  }
  public editTasks(id: number, taskData: Itask): Observable<Itask> {
    const url = `${environment.apiBaseUrl}${this.apiRoutes}/${id}`;
    return this.http.put<Itask>(url, taskData);
  }
  public deleteTasks(id: number): Observable<void> {
    const url = `${environment.apiBaseUrl}${this.apiRoutes}/${id}`;
    return this.http.delete<void>(url);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
