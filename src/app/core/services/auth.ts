import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  name: string;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = '/api/auth'; // Change to your actual API URL

  constructor(private http: HttpClient) {}

  /**
   * Validates email format
   */
  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validates password strength
   */
  private validatePasswordStrength(password: string): { valid: boolean; message?: string } {
    if (password.length < 8) {
      return { valid: false, message: 'Password must be at least 8 characters long' };
    }
    if (!/[a-z]/.test(password)) {
      return { valid: false, message: 'Password must contain lowercase letters' };
    }
    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: 'Password must contain uppercase letters' };
    }
    if (!/[0-9]/.test(password)) {
      return { valid: false, message: 'Password must contain numbers' };
    }
    return { valid: true };
  }

  /**
   * Login user with email and password
   */
  login(email: string, password: string): Observable<AuthResponse> {
    // Client-side validation
    if (!email || !password) {
      return throwError(() => ({
        message: 'Email and password are required',
      }));
    }

    if (!this.validateEmail(email)) {
      return throwError(() => ({
        message: 'Invalid email format',
      }));
    }

    if (password.length < 6) {
      return throwError(() => ({
        message: 'Password must be at least 6 characters',
      }));
    }

    const credentials: LoginCredentials = { email, password };

    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      map((response) => {
        // Store token in localStorage
        if (response.token) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
        }
        return response;
      }),
      catchError((error) => {
        const errorMessage = error.error?.message || 'Login failed. Please check your credentials.';
        return throwError(() => ({ message: errorMessage }));
      })
    );
  }

  /**
   * Sign up new user
   */
  signUp(name: string, email: string, password: string): Observable<AuthResponse> {
    // Client-side validation
    if (!name || !email || !password) {
      return throwError(() => ({
        message: 'All fields are required',
      }));
    }

    if (name.trim().length < 3) {
      return throwError(() => ({
        message: 'Name must be at least 3 characters long',
      }));
    }

    if (!this.validateEmail(email)) {
      return throwError(() => ({
        message: 'Invalid email format',
      }));
    }

    const passwordValidation = this.validatePasswordStrength(password);
    if (!passwordValidation.valid) {
      return throwError(() => ({
        message: passwordValidation.message,
      }));
    }

    const credentials: SignUpCredentials = { name, email, password };

    return this.http.post<AuthResponse>(`${this.apiUrl}/signup`, credentials).pipe(
      map((response) => {
        // Store token in localStorage if provided
        if (response.token) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
        }
        return response;
      }),
      catchError((error) => {
        const errorMessage = error.error?.message || 'Sign up failed. Please try again.';
        return throwError(() => ({ message: errorMessage }));
      })
    );
  }

  /**
   * Logout user
   */
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  /**
   * Get auth token
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}
