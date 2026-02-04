import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';
import { LocalDbService } from './local-db.service';

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    username?: string;
    country?: string;
    role?: string;
    institution?: string;
    avatar?: string;
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
  username?: string;
  country?: string;
  role?: string;
  institution?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private apiUrl = '/api/auth'; // Change to your actual API URL

  constructor(private http: HttpClient, private localDb: LocalDbService) {}

  /**
   * Check if localStorage is available (browser environment)
   */
  private isLocalStorageAvailable(): boolean {
    try {
      const test = '__localStorage_test__';
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(test, test);
        window.localStorage.removeItem(test);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  /**
   * Safely set item in localStorage
   */
  private setStorageItem(key: string, value: string): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem(key, value);
    }
  }

  /**
   * Safely get item from localStorage
   */
  private getStorageItem(key: string): string | null {
    if (this.isLocalStorageAvailable()) {
      return localStorage.getItem(key);
    }
    return null;
  }

  /**
   * Safely remove item from localStorage
   */
  private removeStorageItem(key: string): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem(key);
    }
  }

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

    // Use local database for authentication
    try {
      const user = this.localDb.verifyCredentials(email, password);
      
      if (!user) {
        return throwError(() => ({
          message: 'Invalid email or password',
        }));
      }

      const token = this.localDb.generateToken();
      
      const response: AuthResponse = {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          country: user.country,
          role: user.role,
          institution: user.institution,
          avatar: user.avatar,
        },
      };

      // Store token in localStorage
      this.setStorageItem('authToken', token);
      this.setStorageItem('user', JSON.stringify(response.user));

      // Add delay to simulate API call
      return of(response).pipe(delay(500));
    } catch (error: any) {
      return throwError(() => ({
        message: error.message || 'Login failed. Please try again.',
      }));
    }
  }

  /**
   * Sign up new user
   */
  signUp(
    name: string,
    email: string,
    password: string,
    username?: string,
    country?: string,
    role?: string,
    institution?: string
  ): Observable<AuthResponse> {
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

    if (!username || username.trim().length < 3) {
      return throwError(() => ({
        message: 'Username must be at least 3 characters long',
      }));
    }

    if (!country || country.trim().length === 0) {
      return throwError(() => ({
        message: 'Country is required',
      }));
    }

    if (!role || role.trim().length === 0) {
      return throwError(() => ({
        message: 'Role is required',
      }));
    }

    if (!institution || institution.trim().length < 3) {
      return throwError(() => ({
        message: 'Institution must be at least 3 characters long',
      }));
    }

    const passwordValidation = this.validatePasswordStrength(password);
    if (!passwordValidation.valid) {
      return throwError(() => ({
        message: passwordValidation.message,
      }));
    }

    // Use local database to create user
    try {
      const newUser = this.localDb.createUser({
        name,
        email,
        password,
        username: username || '',
        country: country || '',
        role: role || '',
        institution: institution || '',
      });

      const token = this.localDb.generateToken();

      const response: AuthResponse = {
        token,
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          username: newUser.username,
          country: newUser.country,
          role: newUser.role,
          institution: newUser.institution,
          avatar: newUser.avatar,
        },
      };

      // Store token in localStorage
      this.setStorageItem('authToken', token);
      this.setStorageItem('user', JSON.stringify(response.user));

      // Add delay to simulate API call
      return of(response).pipe(delay(500));
    } catch (error: any) {
      return throwError(() => ({
        message: error.message || 'Sign up failed. Please try again.',
      }));
    }
  }

  /**
   * Logout user
   */
  logout(): void {
    this.removeStorageItem('authToken');
    this.removeStorageItem('user');
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    return !!this.getStorageItem('authToken');
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    const user = this.getStorageItem('user');
    return user ? JSON.parse(user) : null;
  }

  /**
   * Get auth token
   */
  getToken(): string | null {
    return this.getStorageItem('authToken');
  }
}
