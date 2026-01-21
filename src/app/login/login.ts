import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Auth } from '../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  isSignUp = signal(false);
  loginForm!: FormGroup;
  signUpForm!: FormGroup;
  submitted = signal(false);
  loadingState = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  constructor(private fb: FormBuilder, private authService: Auth) {
    this.initializeForms();
  }

  initializeForms() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });

    this.signUpForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      agreeTerms: [false, [Validators.requiredTrue]],
    }, {
      validators: this.passwordMatchValidator.bind(this)
    });
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password');
    const confirmPassword = group.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    if (confirmPassword?.hasError('passwordMismatch')) {
      confirmPassword.setErrors(null);
    }
    
    return null;
  }

  toggleForm() {
    this.isSignUp.set(!this.isSignUp());
    this.submitted.set(false);
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  onLogin() {
    this.submitted.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.loginForm.invalid) {
      this.errorMessage.set('Please fill in all required fields correctly.');
      return;
    }

    this.loadingState.set(true);
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.loadingState.set(false);
        this.successMessage.set('Login successful! Redirecting...');
        this.loginForm.reset();
        // Handle successful login (redirect, etc.)
      },
      error: (error) => {
        this.loadingState.set(false);
        this.errorMessage.set(error.message || 'Login failed. Please try again.');
      },
    });
  }

  onSignUp() {
    this.submitted.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.signUpForm.invalid) {
      this.errorMessage.set('Please fill in all required fields correctly.');
      return;
    }

    this.loadingState.set(true);
    const { name, email, password } = this.signUpForm.value;

    this.authService.signUp(name, email, password).subscribe({
      next: (response) => {
        this.loadingState.set(false);
        this.successMessage.set('Sign up successful! You can now login.');
        this.signUpForm.reset();
        setTimeout(() => this.toggleForm(), 2000);
      },
      error: (error) => {
        this.loadingState.set(false);
        this.errorMessage.set(error.message || 'Sign up failed. Please try again.');
      },
    });
  }

  getLoginErrorMessage(fieldName: string): string {
    const control = this.loginForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email';
    }
    if (control?.hasError('minlength')) {
      return `${fieldName} must be at least ${control.errors?.['minlength'].requiredLength} characters`;
    }
    return '';
  }

  getSignUpErrorMessage(fieldName: string): string {
    const control = this.signUpForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (control?.hasError('email')) {
      return 'Please enter a valid email';
    }
    if (control?.hasError('minlength')) {
      return `${fieldName} must be at least ${control.errors?.['minlength'].requiredLength} characters`;
    }
    if (control?.hasError('passwordMismatch')) {
      return 'Passwords do not match';
    }
    return '';
  }
}
