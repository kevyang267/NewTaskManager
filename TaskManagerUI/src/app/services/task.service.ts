import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { TaskDTO, Task, taskFromDTO, taskToDTO } from '../models/task';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly apiUrl = 'http://localhost:5000/api/v1/TaskManager';

  constructor(private http: HttpClient) {}

  // GET /api/v1/TaskManager
  getAllTasks(): Observable<Task[]> {
    return this.http.get<TaskDTO[]>(this.apiUrl).pipe(
      map((dtos) => dtos.map(taskFromDTO)),
      catchError(this.handleError),
    );
  }

  // GET /api/v1/TaskManager/{id}
  getTaskById(id: number): Observable<Task> {
    return this.http
      .get<TaskDTO>(`${this.apiUrl}/${id}`)
      .pipe(map(taskFromDTO), catchError(this.handleError));
  }

  // POST /api/v1/TaskManager
  createTask(task: Task): Observable<Task> {
    const dto = taskToDTO(task);
    return this.http
      .post<TaskDTO>(this.apiUrl, dto)
      .pipe(map(taskFromDTO), catchError(this.handleError));
  }

  // PATCH /api/v1/TaskManager/{id}
  updateTask(id: number, task: Task): Observable<void> {
    const dto = taskToDTO(task);
    return this.http.patch<void>(`${this.apiUrl}/${id}`, dto).pipe(catchError(this.handleError));
  }

  // DELETE /api/v1/TaskManager/{id}
  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;

      // Handle specific status codes
      if (error.status === 404) {
        errorMessage = 'Task not found';
      } else if (error.status === 400) {
        errorMessage = error.error?.message || 'Bad request';
      }
    }

    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
