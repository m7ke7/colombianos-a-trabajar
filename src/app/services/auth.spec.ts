import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AuthService } from './auth';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [provideHttpClient(), provideRouter([])]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fall back to a local demo registration when the backend is unavailable', () => {
    service.register({ name: 'Demo User', email: 'demo@example.com', password: '123456' }).subscribe({
      next: (response) => {
        expect(response.message).toContain('Registro demo');
      }
    });

    const req = httpMock.expectOne('http://localhost:3001/api/auth/register');
    req.flush({ message: 'Server unavailable' }, { status: 500, statusText: 'Internal Server Error' });

    const storedUsers = localStorage.getItem('demo-users');
    expect(storedUsers).toContain('demo@example.com');
  });
});
