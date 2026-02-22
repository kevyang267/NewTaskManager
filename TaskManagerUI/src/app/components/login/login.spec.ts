import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login';
import { AuthService } from '../../auth/auth.service';

const mockAuthService = {
  login: jasmine.createSpy('login'),
  register: jasmine.createSpy('register'),
};

const mockRouter = {
  navigate: jasmine.createSpy('navigate'),
};

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    mockAuthService.login.calls.reset();
    mockAuthService.register.calls.reset();
    mockRouter.navigate.calls.reset();

    mockAuthService.login.and.returnValue(of(void 0));
    mockAuthService.register.and.returnValue(of(void 0));

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // --- initial state ---

  describe('initial state', () => {
    it('should default to login mode', () => {
      expect(component.isRegistering()).toBeFalse();
    });

    it('should start with empty fields', () => {
      expect(component.email()).toBe('');
      expect(component.password()).toBe('');
      expect(component.errorMessage()).toBe('');
    });
  });

  // --- toggleMode ---

  describe('toggleMode', () => {
    it('should switch from login to register mode', () => {
      component.toggleMode();
      expect(component.isRegistering()).toBeTrue();
    });

    it('should switch back to login mode when toggled again', () => {
      component.toggleMode();
      component.toggleMode();
      expect(component.isRegistering()).toBeFalse();
    });

    it('should clear any existing error message', () => {
      component.errorMessage.set('Some error');
      component.toggleMode();
      expect(component.errorMessage()).toBe('');
    });
  });

  // --- submit validation ---

  describe('submit validation', () => {
    it('should set an error if email is empty', () => {
      component.email.set('');
      component.password.set('password123');
      component.submit();
      expect(component.errorMessage()).toBe('Please enter your email and password.');
      expect(mockAuthService.login).not.toHaveBeenCalled();
    });

    it('should set an error if password is empty', () => {
      component.email.set('test@example.com');
      component.password.set('');
      component.submit();
      expect(component.errorMessage()).toBe('Please enter your email and password.');
      expect(mockAuthService.login).not.toHaveBeenCalled();
    });

    it('should set an error if email is only whitespace', () => {
      component.email.set('   ');
      component.password.set('password123');
      component.submit();
      expect(component.errorMessage()).toBe('Please enter your email and password.');
      expect(mockAuthService.login).not.toHaveBeenCalled();
    });

    it('should set an error if password is only whitespace', () => {
      component.email.set('test@example.com');
      component.password.set('   ');
      component.submit();
      expect(component.errorMessage()).toBe('Please enter your email and password.');
      expect(mockAuthService.login).not.toHaveBeenCalled();
    });
  });

  // --- submit login ---

  describe('submit (login mode)', () => {
    beforeEach(() => {
      component.email.set('test@example.com');
      component.password.set('password123');
    });

    it('should call login with the correct credentials', () => {
      component.submit();
      expect(mockAuthService.login).toHaveBeenCalledOnceWith('test@example.com', 'password123');
    });

    it('should not call register in login mode', () => {
      component.submit();
      expect(mockAuthService.register).not.toHaveBeenCalled();
    });

    it('should navigate to /tasks on success', () => {
      component.submit();
      expect(mockRouter.navigate).toHaveBeenCalledOnceWith(['/tasks']);
    });

    it('should set isLoading to false after success', () => {
      component.submit();
      expect(component.isLoading()).toBeFalse();
    });

    it('should set errorMessage on failure', () => {
      mockAuthService.login.and.returnValue(throwError(() => new Error('401')));
      component.submit();
      expect(component.errorMessage()).toBe('Invalid email or password.');
    });

    it('should set isLoading to false after failure', () => {
      mockAuthService.login.and.returnValue(throwError(() => new Error('401')));
      component.submit();
      expect(component.isLoading()).toBeFalse();
    });

    it('should not navigate on failure', () => {
      mockAuthService.login.and.returnValue(throwError(() => new Error('401')));
      component.submit();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });
  });

  // --- submit register ---

  describe('submit (register mode)', () => {
    beforeEach(() => {
      component.email.set('test@example.com');
      component.password.set('password123');
      component.isRegistering.set(true);
    });

    it('should call register with the correct credentials', () => {
      component.submit();
      expect(mockAuthService.register).toHaveBeenCalledOnceWith('test@example.com', 'password123');
    });

    it('should not call login in register mode', () => {
      component.submit();
      expect(mockAuthService.login).not.toHaveBeenCalled();
    });

    it('should navigate to /tasks on success', () => {
      component.submit();
      expect(mockRouter.navigate).toHaveBeenCalledOnceWith(['/tasks']);
    });

    it('should set a conflict error message on 409', () => {
      mockAuthService.register.and.returnValue(throwError(() => new Error('409')));
      component.submit();
      expect(component.errorMessage()).toBe(
        'An account with this email already exists. Please sign in instead.',
      );
    });

    it('should set a generic error message on other failures', () => {
      mockAuthService.register.and.returnValue(throwError(() => new Error('500')));
      component.submit();
      expect(component.errorMessage()).toBe('Registration failed. Please try again.');
    });

    it('should set isLoading to false after failure', () => {
      mockAuthService.register.and.returnValue(throwError(() => new Error('500')));
      component.submit();
      expect(component.isLoading()).toBeFalse();
    });
  });
});
