import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/auth`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // ensures no unexpected requests were made
  });

  // --- register ---

  describe('register', () => {
    it('should POST to the register endpoint', () => {
      service.register('test@example.com', 'password123').subscribe();

      const req = httpMock.expectOne(`${apiUrl}/register`);
      expect(req.request.method).toBe('POST');
      req.flush(null);
    });

    it('should send email and password in the request body', () => {
      service.register('test@example.com', 'password123').subscribe();

      const req = httpMock.expectOne(`${apiUrl}/register`);
      expect(req.request.body).toEqual({ email: 'test@example.com', password: 'password123' });
      req.flush(null);
    });

    it('should send the request with withCredentials', () => {
      service.register('test@example.com', 'password123').subscribe();

      const req = httpMock.expectOne(`${apiUrl}/register`);
      expect(req.request.withCredentials).toBeTrue();
      req.flush(null);
    });

    it('should propagate errors', () => {
      let error: any;
      service.register('test@example.com', 'password123').subscribe({
        error: (e) => (error = e),
      });

      const req = httpMock.expectOne(`${apiUrl}/register`);
      req.flush('Conflict', { status: 409, statusText: 'Conflict' });

      expect(error.status).toBe(409);
    });
  });

  // --- login ---

  describe('login', () => {
    it('should POST to the login endpoint', () => {
      service.login('test@example.com', 'password123').subscribe();

      const req = httpMock.expectOne(`${apiUrl}/login`);
      expect(req.request.method).toBe('POST');
      req.flush(null);
    });

    it('should send email and password in the request body', () => {
      service.login('test@example.com', 'password123').subscribe();

      const req = httpMock.expectOne(`${apiUrl}/login`);
      expect(req.request.body).toEqual({ email: 'test@example.com', password: 'password123' });
      req.flush(null);
    });

    it('should send the request with withCredentials', () => {
      service.login('test@example.com', 'password123').subscribe();

      const req = httpMock.expectOne(`${apiUrl}/login`);
      expect(req.request.withCredentials).toBeTrue();
      req.flush(null);
    });

    it('should propagate errors', () => {
      let error: any;
      service.login('test@example.com', 'wrongpassword').subscribe({
        error: (e) => (error = e),
      });

      const req = httpMock.expectOne(`${apiUrl}/login`);
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

      expect(error.status).toBe(401);
    });
  });

  // --- logout ---

  describe('logout', () => {
    it('should POST to the logout endpoint', () => {
      service.logout().subscribe();

      const req = httpMock.expectOne(`${apiUrl}/logout`);
      expect(req.request.method).toBe('POST');
      req.flush(null);
    });

    it('should send the request with withCredentials', () => {
      service.logout().subscribe();

      const req = httpMock.expectOne(`${apiUrl}/logout`);
      expect(req.request.withCredentials).toBeTrue();
      req.flush(null);
    });

    it('should send an empty body', () => {
      service.logout().subscribe();

      const req = httpMock.expectOne(`${apiUrl}/logout`);
      expect(req.request.body).toEqual({});
      req.flush(null);
    });
  });

  // --- me ---

  describe('me', () => {
    it('should GET the me endpoint', () => {
      service.me().subscribe();

      const req = httpMock.expectOne(`${apiUrl}/me`);
      expect(req.request.method).toBe('GET');
      req.flush({ email: 'test@example.com' });
    });

    it('should send the request with withCredentials', () => {
      service.me().subscribe();

      const req = httpMock.expectOne(`${apiUrl}/me`);
      expect(req.request.withCredentials).toBeTrue();
      req.flush({ email: 'test@example.com' });
    });

    it('should return the email from the response', () => {
      let result: { email: string } | undefined;
      service.me().subscribe((res) => (result = res));

      const req = httpMock.expectOne(`${apiUrl}/me`);
      req.flush({ email: 'test@example.com' });

      expect(result).toEqual({ email: 'test@example.com' });
    });

    it('should propagate errors', () => {
      let error: any;
      service.me().subscribe({ error: (e) => (error = e) });

      const req = httpMock.expectOne(`${apiUrl}/me`);
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

      expect(error.status).toBe(401);
    });
  });
});
