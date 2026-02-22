import { Component, AfterViewInit, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-manager',
  standalone: true,
  imports: [FormsModule, DatePipe],
  templateUrl: './task-manager.html',
})
export class TaskManager implements AfterViewInit {
  tasks = signal<Task[]>([]);
  newTaskTitle = signal('');
  newTaskDescription = signal('');
  isLoading = signal(false);
  errorMessage = signal('');

  private platformId = inject(PLATFORM_ID);

  constructor(
    private taskService: TaskService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.loadTasks(), 0);
    }
  }

  loadTasks() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.tasks.set(tasks);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set('Failed to load tasks');
        this.isLoading.set(false);
        console.error('Error loading tasks:', error);
      },
    });
  }

  addTask() {
    if (this.newTaskTitle().trim()) {
      const newTask: Task = {
        id: 0,
        title: this.newTaskTitle(),
        description: this.newTaskDescription(),
        isCompleted: false,
        createdAt: new Date(),
        completedAt: null,
      };

      this.taskService.createTask(newTask).subscribe({
        next: (createdTask) => {
          this.tasks.update((tasks) => [...tasks, createdTask]);
          this.newTaskTitle.set('');
          this.newTaskDescription.set('');
        },
        error: (error) => {
          this.errorMessage.set('Failed to create task');
          console.error('Error creating task:', error);
        },
      });
    }
  }

  toggleTask(task: Task) {
    const updatedTask: Task = {
      ...task,
      isCompleted: !task.isCompleted,
      completedAt: !task.isCompleted ? new Date() : null,
    };

    this.taskService.updateTask(task.id, updatedTask).subscribe({
      next: () => {
        this.tasks.update((tasks) => tasks.map((t) => (t.id === task.id ? updatedTask : t)));
      },
      error: (error) => {
        this.errorMessage.set('Failed to update task');
        console.error('Error updating task:', error);
      },
    });
  }

  deleteTask(id: number) {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks.update((tasks) => tasks.filter((t) => t.id !== id));
      },
      error: (error) => {
        this.errorMessage.set('Failed to delete task');
        console.error('Error deleting task:', error);
      },
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login']),
    });
  }
}
