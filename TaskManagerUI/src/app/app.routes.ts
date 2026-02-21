import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';
import { TaskManager } from './components/task-manager/task-manager';
import { LoginComponent } from './components/login/login';

export const routes: Routes = [
  { path: 'tasks', component: TaskManager, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
];
