import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { TaskService } from './task.service';
import { Task, TaskDTO } from '../models/task';
import { environment } from '../../environments/environment';

const apiUrl = `${environment.apiUrl}/TaskManager`;

const mockTask: Task = {
  id: 1,
  title: 'Test Task',
  description: 'Test description',
  isCompleted: false,
  createdAt: new Date('2024-01-01T00:00:00Z'),
  completedAt: null,
};

const mockTaskDTO: TaskDTO = {
  id: 1,
  title: 'Test Task',
  description: 'Test description',
  isCompleted: false,
  createdAt: '2024-01-01T00:00:00Z',
  completedAt: null,
};

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TaskService, { provide: PLATFORM_ID, useValue: 'browser' }],
    });

    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // --- getAllTasks ---

  describe('getAllTasks', () => {
    it('should GET all tasks from the correct endpoint', () => {
      service.getAllTasks().subscribe();

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush([mockTaskDTO]);
    });

    it('should map DTOs to Task models', () => {
      let result: Task[] | undefined;
      service.getAllTasks().subscribe((tasks) => (result = tasks));

      const req = httpMock.expectOne(apiUrl);
      req.flush([mockTaskDTO]);

      expect(result).toBeDefined();
      expect(result![0].id).toBe(mockTask.id);
      expect(result![0].title).toBe(mockTask.title);
      expect(result![0].createdAt).toBeInstanceOf(Date);
    });

    it('should return an empty array when the API returns no tasks', () => {
      let result: Task[] | undefined;
      service.getAllTasks().subscribe((tasks) => (result = tasks));

      const req = httpMock.expectOne(apiUrl);
      req.flush([]);

      expect(result).toEqual([]);
    });

    it('should handle 401 errors', () => {
      let error: Error | undefined;
      service.getAllTasks().subscribe({ error: (e) => (error = e) });

      const req = httpMock.expectOne(apiUrl);
      req.flush(null, { status: 401, statusText: 'Unauthorized' });

      expect(error?.message).toBe('Unauthorized: Please log in');
    });
  });

  // --- getTaskById ---

  describe('getTaskById', () => {
    it('should GET the correct endpoint', () => {
      service.getTaskById(1).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockTaskDTO);
    });

    it('should map the DTO to a Task model', () => {
      let result: Task | undefined;
      service.getTaskById(1).subscribe((task) => (result = task));

      const req = httpMock.expectOne(`${apiUrl}/1`);
      req.flush(mockTaskDTO);

      expect(result?.id).toBe(1);
      expect(result?.createdAt).toBeInstanceOf(Date);
    });

    it('should handle 404 errors', () => {
      let error: Error | undefined;
      service.getTaskById(999).subscribe({ error: (e) => (error = e) });

      const req = httpMock.expectOne(`${apiUrl}/999`);
      req.flush(null, { status: 404, statusText: 'Not Found' });

      expect(error?.message).toBe('Task not found');
    });
  });

  // --- createTask ---

  describe('createTask', () => {
    it('should POST to the correct endpoint', () => {
      service.createTask(mockTask).subscribe();

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      req.flush(mockTaskDTO);
    });

    it('should send the task as a DTO in the request body', () => {
      service.createTask(mockTask).subscribe();

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.body).toBeTruthy();
      expect(req.request.body.title).toBe(mockTask.title);
      req.flush(mockTaskDTO);
    });

    it('should map the response DTO back to a Task model', () => {
      let result: Task | undefined;
      service.createTask(mockTask).subscribe((task) => (result = task));

      const req = httpMock.expectOne(apiUrl);
      req.flush(mockTaskDTO);

      expect(result?.id).toBe(1);
      expect(result?.createdAt).toBeInstanceOf(Date);
    });

    it('should handle 400 errors', () => {
      let error: Error | undefined;
      service.createTask(mockTask).subscribe({ error: (e) => (error = e) });

      const req = httpMock.expectOne(apiUrl);
      req.flush({ message: 'Invalid task data' }, { status: 400, statusText: 'Bad Request' });

      expect(error?.message).toBe('Invalid task data');
    });
  });

  // --- updateTask ---

  describe('updateTask', () => {
    it('should PATCH the correct endpoint', () => {
      service.updateTask(1, mockTask).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('PATCH');
      req.flush(null);
    });

    it('should send the task as a DTO in the request body', () => {
      service.updateTask(1, mockTask).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.body.title).toBe(mockTask.title);
      req.flush(null);
    });

    it('should handle 404 errors', () => {
      let error: Error | undefined;
      service.updateTask(999, mockTask).subscribe({ error: (e) => (error = e) });

      const req = httpMock.expectOne(`${apiUrl}/999`);
      req.flush(null, { status: 404, statusText: 'Not Found' });

      expect(error?.message).toBe('Task not found');
    });

    it('should handle 401 errors', () => {
      let error: Error | undefined;
      service.updateTask(1, mockTask).subscribe({ error: (e) => (error = e) });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      req.flush(null, { status: 401, statusText: 'Unauthorized' });

      expect(error?.message).toBe('Unauthorized: Please log in');
    });
  });

  // --- deleteTask ---

  describe('deleteTask', () => {
    it('should DELETE the correct endpoint', () => {
      service.deleteTask(1).subscribe();

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });

    it('should handle 404 errors', () => {
      let error: Error | undefined;
      service.deleteTask(999).subscribe({ error: (e) => (error = e) });

      const req = httpMock.expectOne(`${apiUrl}/999`);
      req.flush(null, { status: 404, statusText: 'Not Found' });

      expect(error?.message).toBe('Task not found');
    });

    it('should handle 401 errors', () => {
      let error: Error | undefined;
      service.deleteTask(1).subscribe({ error: (e) => (error = e) });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      req.flush(null, { status: 401, statusText: 'Unauthorized' });

      expect(error?.message).toBe('Unauthorized: Please log in');
    });
  });

  // --- handleError ---

  describe('handleError', () => {
    it('should return a generic message for unknown errors', () => {
      let error: Error | undefined;
      service.getAllTasks().subscribe({ error: (e) => (error = e) });

      const req = httpMock.expectOne(apiUrl);
      req.flush(null, { status: 500, statusText: 'Server Error' });

      expect(error?.message).toContain('Error Code: 500');
    });

    it('should return a 400 message from the error body if present', () => {
      let error: Error | undefined;
      service.getAllTasks().subscribe({ error: (e) => (error = e) });

      const req = httpMock.expectOne(apiUrl);
      req.flush(
        { message: 'Custom bad request message' },
        { status: 400, statusText: 'Bad Request' },
      );

      expect(error?.message).toBe('Custom bad request message');
    });

    it('should fall back to "Bad request" for 400 with no body message', () => {
      let error: Error | undefined;
      service.getAllTasks().subscribe({ error: (e) => (error = e) });

      const req = httpMock.expectOne(apiUrl);
      req.flush(null, { status: 400, statusText: 'Bad Request' });

      expect(error?.message).toBe('Bad request');
    });
  });
});
