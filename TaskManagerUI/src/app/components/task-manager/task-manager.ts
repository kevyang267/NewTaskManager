import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task';

@Component({
  selector: 'app-task-manager',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './task-manager.html',
})
export class TaskManager implements OnInit {
  tasks: Task[] = [];
  newTaskTitle: string = '';
  newTaskDescription: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.isLoading = true;
    this.errorMessage = '';

    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load tasks';
        this.isLoading = false;
        console.error('Error loading tasks:', error);
      },
    });
  }

  addTask() {
    if (this.newTaskTitle.trim()) {
      const newTask: Task = {
        id: 0, // API will assign the real ID
        title: this.newTaskTitle,
        description: this.newTaskDescription,
        isCompleted: false,
        createdAt: new Date(),
        completedAt: null,
      };

      this.taskService.createTask(newTask).subscribe({
        next: (createdTask) => {
          this.tasks.push(createdTask);
          this.newTaskTitle = '';
          this.newTaskDescription = '';
        },
        error: (error) => {
          this.errorMessage = 'Failed to create task';
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
        task.isCompleted = updatedTask.isCompleted;
        task.completedAt = updatedTask.completedAt;
      },
      error: (error) => {
        this.errorMessage = 'Failed to update task';
        console.error('Error updating task:', error);
      },
    });
  }

  deleteTask(id: number) {
    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.tasks = this.tasks.filter((task) => task.id !== id);
      },
      error: (error) => {
        this.errorMessage = 'Failed to delete task';
        console.error('Error deleting task:', error);
      },
    });
  }
}
