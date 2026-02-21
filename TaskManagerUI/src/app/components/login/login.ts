import { Component } from '@angular/core';
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
  email: string = '';
  password: string = '';
  isRegistering: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  submit() {
    if (!this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'Please enter your email and password.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const action$ = this.isRegistering
      ? this.authService.register(this.email, this.password)
      : this.authService.login(this.email, this.password);

    action$.subscribe({
      next: () => {
        this.router.navigate(['/tasks']);
      },
      error: (error) => {
        this.errorMessage = this.isRegistering
          ? 'Registration failed. Please try again.'
          : 'Invalid email or password.';
        this.isLoading = false;
        console.error('Auth error:', error);
      },
    });
  }

  toggleMode() {
    this.isRegistering = !this.isRegistering;
    this.errorMessage = '';
  }
}
