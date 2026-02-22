import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { TaskManager } from './task-manager';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task';

const mockTasks: Task[] = [
  {
    id: 1,
    title: 'Task One',
    description: 'First task',
    isCompleted: false,
    createdAt: new Date('2024-01-01'),
    completedAt: null,
  },
  {
    id: 2,
    title: 'Task Two',
    description: 'Second task',
    isCompleted: true,
    createdAt: new Date('2024-01-02'),
    completedAt: new Date('2024-01-03'),
  },
];

const mockTaskService = {
  getAllTasks: jasmine.createSpy('getAllTasks').and.returnValue(of(mockTasks)),
  createTask: jasmine.createSpy('createTask'),
  updateTask: jasmine.createSpy('updateTask').and.returnValue(of(void 0)),
  deleteTask: jasmine.createSpy('deleteTask').and.returnValue(of(void 0)),
};

describe('TaskManager', () => {
  let component: TaskManager;
  let fixture: ComponentFixture<TaskManager>;

  beforeEach(async () => {
    mockTaskService.getAllTasks.calls.reset();
    mockTaskService.createTask.calls.reset();
    mockTaskService.updateTask.calls.reset();
    mockTaskService.deleteTask.calls.reset();

    mockTaskService.getAllTasks.and.returnValue(of(mockTasks));
    mockTaskService.updateTask.and.returnValue(of(void 0));
    mockTaskService.deleteTask.and.returnValue(of(void 0));

    await TestBed.configureTestingModule({
      imports: [TaskManager],
      providers: [{ provide: TaskService, useValue: mockTaskService }],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskManager);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // --- loadTasks ---

  describe('loadTasks', () => {
    it('should populate the tasks signal with data from the service', () => {
      expect(component.tasks()).toEqual(mockTasks);
    });

    it('should set isLoading to false after tasks load', () => {
      expect(component.isLoading()).toBeFalse();
    });

    it('should set errorMessage on failure', () => {
      mockTaskService.getAllTasks.and.returnValue(throwError(() => new Error('Network error')));
      component.loadTasks();
      expect(component.errorMessage()).toBe('Failed to load tasks');
      expect(component.isLoading()).toBeFalse();
    });
  });

  // --- addTask ---

  describe('addTask', () => {
    it('should not call the service if the title is empty', () => {
      mockTaskService.createTask.and.returnValue(of({} as Task));
      component.newTaskTitle.set('');
      component.addTask();
      expect(mockTaskService.createTask).not.toHaveBeenCalled();
    });

    it('should not call the service if the title is only whitespace', () => {
      mockTaskService.createTask.and.returnValue(of({} as Task));
      component.newTaskTitle.set('   ');
      component.addTask();
      expect(mockTaskService.createTask).not.toHaveBeenCalled();
    });

    it('should call the service and append the new task', () => {
      const createdTask: Task = {
        id: 3,
        title: 'New Task',
        description: 'New description',
        isCompleted: false,
        createdAt: new Date(),
        completedAt: null,
      };
      mockTaskService.createTask.and.returnValue(of(createdTask));

      component.newTaskTitle.set('New Task');
      component.newTaskDescription.set('New description');
      component.addTask();

      expect(mockTaskService.createTask).toHaveBeenCalledOnceWith(
        jasmine.objectContaining({ title: 'New Task', description: 'New description' }),
      );
      expect(component.tasks()).toContain(createdTask);
    });

    it('should clear the input fields after a successful add', () => {
      const createdTask: Task = {
        id: 3,
        title: 'New Task',
        description: '',
        isCompleted: false,
        createdAt: new Date(),
        completedAt: null,
      };
      mockTaskService.createTask.and.returnValue(of(createdTask));

      component.newTaskTitle.set('New Task');
      component.newTaskDescription.set('Some description');
      component.addTask();

      expect(component.newTaskTitle()).toBe('');
      expect(component.newTaskDescription()).toBe('');
    });

    it('should set errorMessage on failure', () => {
      mockTaskService.createTask.and.returnValue(throwError(() => new Error('Failed')));
      component.newTaskTitle.set('New Task');
      component.addTask();
      expect(component.errorMessage()).toBe('Failed to create task');
    });
  });

  // --- toggleTask ---

  describe('toggleTask', () => {
    it('should mark an incomplete task as completed', () => {
      const task = mockTasks[0]; // isCompleted: false
      component.toggleTask(task);

      expect(mockTaskService.updateTask).toHaveBeenCalledOnceWith(
        task.id,
        jasmine.objectContaining({ isCompleted: true }),
      );
    });

    it('should set completedAt when completing a task', () => {
      const task = mockTasks[0]; // isCompleted: false
      component.toggleTask(task);

      const updatedTask = mockTaskService.updateTask.calls.mostRecent().args[1] as Task;
      expect(updatedTask.completedAt).not.toBeNull();
      expect(updatedTask.completedAt).toBeInstanceOf(Date);
    });

    it('should mark a completed task as incomplete', () => {
      const task = mockTasks[1]; // isCompleted: true
      component.toggleTask(task);

      expect(mockTaskService.updateTask).toHaveBeenCalledOnceWith(
        task.id,
        jasmine.objectContaining({ isCompleted: false }),
      );
    });

    it('should clear completedAt when uncompleting a task', () => {
      const task = mockTasks[1]; // isCompleted: true
      component.toggleTask(task);

      const updatedTask = mockTaskService.updateTask.calls.mostRecent().args[1] as Task;
      expect(updatedTask.completedAt).toBeNull();
    });

    it('should update the task in the tasks signal on success', () => {
      const task = mockTasks[0];
      component.toggleTask(task);

      const updated = component.tasks().find((t) => t.id === task.id);
      expect(updated?.isCompleted).toBeTrue();
    });

    it('should set errorMessage on failure', () => {
      mockTaskService.updateTask.and.returnValue(throwError(() => new Error('Failed')));
      component.toggleTask(mockTasks[0]);
      expect(component.errorMessage()).toBe('Failed to update task');
    });
  });

  // --- deleteTask ---

  describe('deleteTask', () => {
    it('should call the service with the correct id', () => {
      component.deleteTask(1);
      expect(mockTaskService.deleteTask).toHaveBeenCalledOnceWith(1);
    });

    it('should remove the deleted task from the tasks signal', () => {
      component.deleteTask(1);
      expect(component.tasks().find((t) => t.id === 1)).toBeUndefined();
    });

    it('should leave other tasks intact after deletion', () => {
      component.deleteTask(1);
      expect(component.tasks().find((t) => t.id === 2)).toBeDefined();
    });

    it('should set errorMessage on failure', () => {
      mockTaskService.deleteTask.and.returnValue(throwError(() => new Error('Failed')));
      component.deleteTask(1);
      expect(component.errorMessage()).toBe('Failed to delete task');
    });
  });
});
