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
  private apiUrl = 'https://hiringtoll.onrender.com/api/auth';

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
   * Login user with email and password via API
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

    const payload = {
      email: email.trim(),
      password: password,
    };

    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, payload).pipe(
      map((response) => {
        this.setStorageItem('authToken', response.token);
        this.setStorageItem('user', JSON.stringify(response.user));
        return response;
      }),
      catchError((error: any) => {
        const errorMessage =
          error.error?.message || error.message || 'Login failed. Please try again.';
        return throwError(() => ({ message: errorMessage }));
      })
    );
  }

  /**
   * Sign up new user via API
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

    const passwordValidation = this.validatePasswordStrength(password);
    if (!passwordValidation.valid) {
      return throwError(() => ({
        message: passwordValidation.message,
      }));
    }

    // Prepare request payload
    const payload = {
      name: name.trim(),
      email: email.trim(),
      password: password,
      username: username?.trim() || '',
      country: country?.trim() || '',
      role: role?.trim() || '',
      institution: institution?.trim() || '',
    };

    // Call API endpoint
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, payload).pipe(
      map(response => {
        // We do NOT store token here because email verification is mandatory
        // The user will be redirected to OTP verification first
        console.log('Signup successful, verification required for:', payload.email);
        return response;
      }),
      catchError(error => {
        console.error('Signup error:', error);
        const errorMessage = error.error?.message || error.message || 'Sign up failed. Please try again.';
        return throwError(() => ({
          message: errorMessage,
        }));
      })
    );
  }

  /**
   * Verify email with OTP
   */
  verifyEmail(email: string, otp: string): Observable<any> {
    // Client-side validation
    if (!email || !otp) {
      return throwError(() => ({
        message: 'Email and OTP are required',
      }));
    }

    if (!this.validateEmail(email)) {
      return throwError(() => ({
        message: 'Invalid email format',
      }));
    }

    const cleanOtp = otp.trim().replace(/\s/g, '');
    if (cleanOtp.length === 0) {
      return throwError(() => ({
        message: 'OTP cannot be empty',
      }));
    }

    const numOtp = parseInt(cleanOtp, 10);
    const payload = {
      email: email.trim(),
      otp: cleanOtp,
      code: cleanOtp // Fallback for diff backend implementations
    };

    console.log('Attempting verifyEmail with:', payload);

    return this.http.post<any>(`${this.apiUrl}/verify-email`, payload).pipe(
      map((response) => {
        console.log('Verification success response:', response);
        // Handle cases where backend returns 200 OK but with success: false
        if (response && response.success === false) {
          throw { error: { message: response.message || 'Verification failed' } };
        }
        // If verification is successful and token is returned, store it
        if (response.token) {
          this.setStorageItem('authToken', response.token);
        }
        if (response.user) {
          this.setStorageItem('user', JSON.stringify(response.user));
        }
        return response;
      }),
      catchError((error: any) => {
        console.error('Verification error:', error);
        
        // Try numeric retry if it failed with string but not with 404
        if (!isNaN(numOtp) && error.status !== 404) {
          console.log('Retrying verify-email with numeric OTP');
          return this.http.post<any>(`${this.apiUrl}/verify-email`, { ...payload, otp: numOtp, code: numOtp });
        }

        const errorMessage =
          error.error?.message || error.message || 'Email verification failed';
        return throwError(() => ({ message: errorMessage }));
      })
    );
  }

  /**
   * Request password reset via email
   */
  forgotPassword(email: string): Observable<any> {
    // Client-side validation
    if (!email) {
      return throwError(() => ({
        message: 'Email is required',
      }));
    }

    if (!this.validateEmail(email)) {
      return throwError(() => ({
        message: 'Invalid email format',
      }));
    }

    const payload = {
      email: email.trim(),
    };

    return this.http.post<any>(`${this.apiUrl}/forgot-password`, payload).pipe(
      map((response) => {
        return response;
      }),
      catchError((error: any) => {
        const errorMessage =
          error.error?.message || error.message || 'Failed to process forgot password request';
        return throwError(() => ({ message: errorMessage }));
      })
    );
  }

  /**
   * Verify OTP for forgot password
   */
  verifyForgotPasswordOtp(email: string, otp: string): Observable<any> {
    if (!email || !otp) {
      return throwError(() => ({ message: 'Email and OTP are required' }));
    }

    const cleanOtp = otp.trim().replace(/\s/g, '');
    // Try to provide both common field names (otp/code) and handle number/string conversion
    const numOtp = parseInt(cleanOtp, 10);
    const payload = {
      email: email.trim(),
      otp: cleanOtp,
      code: cleanOtp,
    };

    console.log('Attempting verifyForgotPasswordOtp with payload:', payload);

    return this.http.post<any>(`${this.apiUrl}/verify-forgot-password-otp`, payload).pipe(
      map(response => {
        if (response && response.success === false) {
          throw { error: { message: response.message || 'OTP verification failed' } };
        }
        return response;
      }),
      catchError((error) => {
        console.warn('verify-forgot-password-otp failed, status:', error.status);

        // Fallback 1: Try with numeric OTP if it failed with string
        if (!isNaN(numOtp) && error.status !== 404) {
          const numericPayload = { ...payload, otp: numOtp, code: numOtp };
          console.log('Retrying with numeric payload:', numericPayload);
          return this.http.post<any>(`${this.apiUrl}/verify-forgot-password-otp`, numericPayload);
        }

        // Fallback 2: Try other common verification endpoints if 404
        if (error.status === 404) {
          console.log('Endpoint not found, trying common fallbacks...');
          const fallbacks = [
            `${this.apiUrl}/verify-forgot-password`,
            `${this.apiUrl}/verify-email`, 
            `${this.apiUrl}/verify-otp`,
            `${this.apiUrl}/verify`
          ];
          
          // Using a simple recursion-like pattern to try fallbacks
          let tryNext = (index: number): Observable<any> => {
            if (index >= fallbacks.length) {
              return throwError(() => error);
            }
            console.log(`Trying fallback ${index + 1}: ${fallbacks[index]}`);
            return this.http.post<any>(fallbacks[index], payload).pipe(
              catchError(err => {
                if (err.status === 404) return tryNext(index + 1);
                return throwError(() => err);
              })
            );
          };
          
          return tryNext(0);
        }

        return throwError(() => ({
          message: error.error?.message || error.message || 'OTP verification failed',
        }));
      })
    );
  }

  /**
   * Reset password after OTP verification
   */
  resetPassword(email: string, otp: string, newPassword: string): Observable<any> {
    // Client-side validation
    if (!email || !otp || !newPassword) {
      return throwError(() => ({
        message: 'Email, OTP, and new password are required',
      }));
    }

    if (!this.validateEmail(email)) {
      return throwError(() => ({
        message: 'Invalid email format',
      }));
    }

    const cleanOtp = otp.trim().replace(/\s/g, '');
    if (cleanOtp.length === 0) {
      return throwError(() => ({
        message: 'OTP cannot be empty',
      }));
    }

    const passwordValidation = this.validatePasswordStrength(newPassword);
    if (!passwordValidation.valid) {
      return throwError(() => ({
        message: passwordValidation.message,
      }));
    }

    const payload = {
      email: email.trim(),
      otp: cleanOtp,
      newPassword: newPassword,
    };

    return this.http.post<any>(`${this.apiUrl}/reset-password`, payload).pipe(
      map((response) => {
        return response;
      }),
      catchError((error: any) => {
        const errorMessage =
          error.error?.message || error.message || 'Failed to reset password';
        return throwError(() => ({ message: errorMessage }));
      })
    );
  }

  /**
   * Resend OTP to email
   */
  resendOtp(email: string): Observable<any> {
    // Client-side validation
    if (!email) {
      return throwError(() => ({
        message: 'Email is required',
      }));
    }

    if (!this.validateEmail(email)) {
      return throwError(() => ({
        message: 'Invalid email format',
      }));
    }

    const payload = {
      email: email.trim(),
    };

    return this.http.post<any>(`${this.apiUrl}/resend-otp`, payload).pipe(
      map((response) => {
        return response;
      }),
      catchError((error: any) => {
        const errorMessage =
          error.error?.message || error.message || 'Failed to resend OTP';
        return throwError(() => ({ message: errorMessage }));
      })
    );
  }

  /**
   * Get user profile details
   */
  getUserProfile(): Observable<any> {
    const baseApiUrl = 'https://hiringtoll.onrender.com/api';
    return this.http.get<any>(`${baseApiUrl}/me`).pipe(
      catchError((error: any) => {
        const errorMessage =
          error.error?.message || error.message || 'Failed to fetch user profile';
        return throwError(() => ({ message: errorMessage }));
      })
    );
  }

  /**
   * Update user profile
   */
  updateUserProfile(profileData: { gender?: string; bio?: string }): Observable<any> {
    // Client-side validation
    if (!profileData || Object.keys(profileData).length === 0) {
      return throwError(() => ({
        message: 'Profile data is required',
      }));
    }

    const baseApiUrl = 'https://hiringtoll.onrender.com/api';
    const payload = {
      gender: profileData.gender?.trim() || '',
      bio: profileData.bio?.trim() || '',
    };

    return this.http.put<any>(`${baseApiUrl}/me`, payload).pipe(
      map((response) => {
        // Update user data in localStorage if included in response
        if (response.user) {
          this.setStorageItem('user', JSON.stringify(response.user));
        }
        return response;
      }),
      catchError((error: any) => {
        const errorMessage =
          error.error?.message || error.message || 'Failed to update profile';
        return throwError(() => ({ message: errorMessage }));
      })
    );
  }

  /**
   * Upload profile avatar
   */
  uploadAvatar(file: File): Observable<any> {
    // Client-side validation
    if (!file) {
      return throwError(() => ({
        message: 'File is required',
      }));
    }

    const baseApiUrl = 'https://hiringtoll.onrender.com/api';
    const formData = new FormData();
    formData.append('avatar', file);

    return this.http.post<any>(`${baseApiUrl}/me/avatar`, formData).pipe(
      map((response) => {
        // Update user data in localStorage if included in response
        if (response.user) {
          this.setStorageItem('user', JSON.stringify(response.user));
        }
        return response;
      }),
      catchError((error: any) => {
        const errorMessage =
          error.error?.message || error.message || 'Failed to upload avatar';
        return throwError(() => ({ message: errorMessage }));
      })
    );
  }

  /**
   * Delete profile avatar
   */
  deleteAvatar(): Observable<any> {
    const baseApiUrl = 'https://hiringtoll.onrender.com/api';
    return this.http.delete<any>(`${baseApiUrl}/me/avatar`).pipe(
      map((response) => {
        // Update user data in localStorage if included in response
        if (response.user) {
          this.setStorageItem('user', JSON.stringify(response.user));
        }
        return response;
      }),
      catchError((error: any) => {
        const errorMessage =
          error.error?.message || error.message || 'Failed to delete avatar';
        return throwError(() => ({ message: errorMessage }));
      })
    );
  }

  /**
   * Deactivate user account
   */
  deactivateAccount(): Observable<any> {
    const baseApiUrl = 'https://hiringtoll.onrender.com/api';
    return this.http.delete<any>(`${baseApiUrl}/me`).pipe(
      map((response) => {
        // Clear user data from localStorage
        this.removeStorageItem('authToken');
        this.removeStorageItem('user');
        return response;
      }),
      catchError((error: any) => {
        const errorMessage =
          error.error?.message || error.message || 'Failed to deactivate account';
        return throwError(() => ({ message: errorMessage }));
      })
    );
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
