import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TaskDTO, Task, taskFromDTO, taskToDTO } from '../models/task';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly apiUrl = `${environment.apiUrl}/TaskManager`;
  private readonly platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient) {}

  // GET /api/v1/TaskManager
  getAllTasks(): Observable<Task[]> {
    return this.http.get<TaskDTO[]>(this.apiUrl).pipe(
      map((dtos) => dtos.map(taskFromDTO)),
      catchError((err) => this.handleError(err)),
    );
  }

  // GET /api/v1/TaskManager/{id}
  getTaskById(id: number): Observable<Task> {
    return this.http.get<TaskDTO>(`${this.apiUrl}/${id}`).pipe(
      map(taskFromDTO),
      catchError((err) => this.handleError(err)),
    );
  }

  // POST /api/v1/TaskManager
  createTask(task: Task): Observable<Task> {
    const dto = taskToDTO(task);
    return this.http.post<TaskDTO>(this.apiUrl, dto).pipe(
      map(taskFromDTO),
      catchError((err) => this.handleError(err)),
    );
  }

  // PATCH /api/v1/TaskManager/{id}
  updateTask(id: number, task: Task): Observable<void> {
    const dto = taskToDTO(task);
    return this.http
      .patch<void>(`${this.apiUrl}/${id}`, dto)
      .pipe(catchError((err) => this.handleError(err)));
  }

  // DELETE /api/v1/TaskManager/{id}
  deleteTask(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError((err) => this.handleError(err)));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';

    if (isPlatformBrowser(this.platformId) && error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status ?? 'unknown'}\nMessage: ${error.message}`;

      if (error.status === 404) {
        errorMessage = 'Task not found';
      } else if (error.status === 400) {
        errorMessage = error.error?.message || 'Bad request';
      } else if (error.status === 401) {
        errorMessage = 'Unauthorized: Please log in';
      }
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
