import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  isSignUp = signal(false);
  isOtpVerificationStep = signal(false);
  isSignUpOtpVerification = signal(false);
  loginForm!: FormGroup;
  signUpForm!: FormGroup;
  otpForm!: FormGroup;
  submitted = signal(false);
  loadingState = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  userEmailForOtp = signal('');
  otpResendCooldown = signal(0);
  otpResendTimer: any;

  constructor(private fb: FormBuilder, private authService: Auth, private router: Router) {
    this.initializeForms();
  }

  initializeForms() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.signUpForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      country: ['', [Validators.required]],
      role: ['', [Validators.required]],
      institution: ['', [Validators.required, Validators.minLength(3)]],
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
    this.isOtpVerificationStep.set(false);
    this.isSignUpOtpVerification.set(false);
    this.submitted.set(false);
    this.errorMessage.set('');
    this.successMessage.set('');
    this.loadingState.set(false);
    this.loginForm.reset();
    this.signUpForm.reset();
    this.otpForm.reset();
    this.userEmailForOtp.set('');
    // Mark form as untouched to hide validation errors
    this.loginForm.markAsUntouched();
    this.signUpForm.markAsUntouched();
    this.otpForm.markAsUntouched();
  }

  onLogin() {
    this.submitted.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.loginForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
      this.errorMessage.set('Please fill in all required fields correctly.');
      return;
    }

    this.loadingState.set(true);
    const { email, password } = this.loginForm.value;
    this.userEmailForOtp.set(email);

    this.authService.login(email, password).subscribe({
      next: (response) => {
        this.loadingState.set(false);
        this.isOtpVerificationStep.set(false);
        this.isSignUpOtpVerification.set(false);
        this.successMessage.set('Login successful. Redirecting to dashboard...');
        this.submitted.set(false);

        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 500);
      },
      error: (error) => {
        this.loadingState.set(false);
        this.submitted.set(false);
        this.errorMessage.set(error.message || 'Login failed. Please try again.');
      },
    });
  }

  onVerifyOtp() {
    this.submitted.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.otpForm.invalid) {
      Object.keys(this.otpForm.controls).forEach(key => {
        this.otpForm.get(key)?.markAsTouched();
      });
      this.errorMessage.set('Please enter a valid OTP.');
      return;
    }

    this.loadingState.set(true);
    let { otp } = this.otpForm.value;
    const email = this.userEmailForOtp();
    
    // Remove any spaces from OTP
    otp = otp.replace(/\s/g, '').trim();

    this.authService.verifyEmail(email, otp).subscribe({
      next: (response) => {
        this.loadingState.set(false);
        this.successMessage.set('Email verified! Redirecting to dashboard...');
        this.otpForm.reset();
        this.submitted.set(false);
        this.isOtpVerificationStep.set(false);
        // Redirect to dashboard after 1 second
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1000);
      },
      error: (error) => {
        this.loadingState.set(false);
        this.submitted.set(false);
        this.errorMessage.set(error.error?.message || error.message || 'OTP verification failed. Please check the OTP and try again.');
        console.error('OTP Verification Error:', error);
      },
    });
  }

  onResendOtp() {
    // Check if cooldown is active
    if (this.otpResendCooldown() > 0) {
      this.errorMessage.set(`Please wait ${this.otpResendCooldown()}s before requesting another OTP`);
      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');
    this.loadingState.set(true);
    const email = this.userEmailForOtp();

    this.authService.resendOtp(email).subscribe({
      next: (response) => {
        this.loadingState.set(false);
        this.successMessage.set('OTP resent to your email. Check your inbox.');
        this.otpForm.reset();
        this.startResendCooldown();
      },
      error: (error) => {
        this.loadingState.set(false);
        this.errorMessage.set(error.message || 'Failed to resend OTP. Please try again.');
      },
    });
  }

  startResendCooldown() {
    let countdown = 120; // 120 seconds cooldown
    this.otpResendCooldown.set(countdown);
    
    // Clear any existing timer
    if (this.otpResendTimer) {
      clearInterval(this.otpResendTimer);
    }

    this.otpResendTimer = setInterval(() => {
      countdown--;
      this.otpResendCooldown.set(countdown);
      
      if (countdown <= 0) {
        clearInterval(this.otpResendTimer);
        this.otpResendCooldown.set(0);
      }
    }, 1000);
  }

  goBackToLogin() {
    this.isOtpVerificationStep.set(false);
    this.otpForm.reset();
    this.submitted.set(false);
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  onSignUp() {
    this.submitted.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.signUpForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.signUpForm.controls).forEach(key => {
        this.signUpForm.get(key)?.markAsTouched();
      });
      this.errorMessage.set('Please fill in all required fields correctly.');
      return;
    }

    this.loadingState.set(true);
    const { name, email, password, username, country, role, institution } = this.signUpForm.value;
    this.userEmailForOtp.set(email);

    this.authService.signUp(name, email, password, username, country, role, institution).subscribe({
      next: (response) => {
        this.loadingState.set(false);
        this.successMessage.set('Account created! OTP sent to your email. Please verify to activate your account.');
        // Move to OTP verification step within signup
        this.isSignUpOtpVerification.set(true);
        this.otpForm.reset();
        this.submitted.set(false);
      },
      error: (error) => {
        this.loadingState.set(false);
        this.submitted.set(false);
        this.errorMessage.set(error.message || 'Sign up failed. Please try again.');
      },
    });
  }

  onVerifySignUpOtp() {
    this.submitted.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.otpForm.invalid) {
      Object.keys(this.otpForm.controls).forEach(key => {
        this.otpForm.get(key)?.markAsTouched();
      });
      this.errorMessage.set('Please enter a valid OTP.');
      return;
    }

    this.loadingState.set(true);
    let { otp } = this.otpForm.value;
    const email = this.userEmailForOtp();
    
    // Remove any spaces from OTP
    otp = otp.replace(/\s/g, '').trim();

    this.authService.verifyEmail(email, otp).subscribe({
      next: (response) => {
        this.loadingState.set(false);
        this.successMessage.set('Email verified successfully! Your account is now active. Switching to login...');
        this.otpForm.reset();
        this.submitted.set(false);
        this.isSignUpOtpVerification.set(false);
        this.signUpForm.reset();
        this.signUpForm.markAsUntouched();
        // Switch back to login form after a delay
        setTimeout(() => {
          this.isSignUp.set(false);
          this.userEmailForOtp.set('');
          this.errorMessage.set('');
          this.successMessage.set('');
        }, 2000);
      },
      error: (error) => {
        this.loadingState.set(false);
        this.submitted.set(false);
        this.errorMessage.set(error.error?.message || error.message || 'OTP verification failed. Please check the OTP and try again.');
        console.error('OTP Verification Error:', error);
      },
    });
  }

  onResendSignUpOtp() {
    // Check if cooldown is active
    if (this.otpResendCooldown() > 0) {
      this.errorMessage.set(`Please wait ${this.otpResendCooldown()}s before requesting another OTP`);
      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');
    this.loadingState.set(true);
    const email = this.userEmailForOtp();

    this.authService.resendOtp(email).subscribe({
      next: (response) => {
        this.loadingState.set(false);
        this.successMessage.set('OTP resent to your email. Check your inbox.');
        this.otpForm.reset();
        this.startResendCooldown();
      },
      error: (error) => {
        this.loadingState.set(false);
        this.errorMessage.set(error.message || 'Failed to resend OTP. Please try again.');
      },
    });
  }

  goBackToSignUp() {
    this.isSignUpOtpVerification.set(false);
    this.otpForm.reset();
    this.submitted.set(false);
    this.errorMessage.set('');
    this.successMessage.set('');
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
    if (!control) return '';

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
    if (control?.hasError('requiredTrue')) {
      return 'You must agree to the terms and conditions';
    }
    return '';
  }

  getOtpErrorMessage(fieldName: string): string {
    const control = this.otpForm.get(fieldName);
    if (control?.hasError('required')) {
      return 'OTP is required';
    }
    if (control?.hasError('minlength')) {
      return `OTP must be at least ${control.errors?.['minlength'].requiredLength} characters`;
    }
    return '';
  }
}
