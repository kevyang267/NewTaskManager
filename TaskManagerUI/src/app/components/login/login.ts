import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  email = signal('');
  password = signal('');
  isRegistering = signal(false);
  isLoading = signal(false);
  errorMessage = signal('');

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  submit() {
    if (!this.email().trim() || !this.password().trim()) {
      this.errorMessage.set('Please enter your email and password.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const action$ = this.isRegistering()
      ? this.authService.register(this.email(), this.password())
      : this.authService.login(this.email(), this.password());

    action$.subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/tasks']);
      },
      error: (error) => {
        if (this.isRegistering()) {
          if (error?.message?.includes('409')) {
            this.errorMessage.set(
              'An account with this email already exists. Please sign in instead.',
            );
          } else {
            this.errorMessage.set('Registration failed. Please try again.');
          }
        } else {
          this.errorMessage.set('Invalid email or password.');
        }
        this.isLoading.set(false);
        console.error('Auth error:', error);
      },
    });
  }

  toggleMode() {
    this.isRegistering.update((v) => !v);
    this.errorMessage.set('');
  }
}
