import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../core/services/auth';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

type AuthStep = 'login' | 'signup' | 'login-otp' | 'signup-otp' | 'forgot-password' | 'forgot-password-otp' | 'reset-password';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit, OnDestroy {
  // Auth Step Signals
  authStep = signal<AuthStep>('login');

  // Form Signals
  loginForm!: FormGroup;
  signUpForm!: FormGroup;
  otpForm!: FormGroup;
  forgotPasswordForm!: FormGroup;
  resetPasswordForm!: FormGroup;

  // State Signals
  submitted = signal(false);
  loadingState = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  userEmailForOtp = signal('');
  verifiedOtp = signal('');
  otpResendCooldown = signal(0);
  
  // Private
  private otpResendTimer: any;
  private destroy$ = new Subject<void>();

  // Computed properties for template
  isLogin = () => this.authStep() === 'login';
  isSignUp = () => this.authStep() === 'signup';
  isLoginOtp = () => this.authStep() === 'login-otp';
  isSignUpOtp = () => this.authStep() === 'signup-otp';
  isForgotPassword = () => this.authStep() === 'forgot-password';
  isForgotPasswordOtp = () => this.authStep() === 'forgot-password-otp';
  isResetPassword = () => this.authStep() === 'reset-password';

  constructor(private fb: FormBuilder, private authService: Auth, private router: Router) {
    this.initializeForms();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (this.otpResendTimer) clearInterval(this.otpResendTimer);
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForms(): void {
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
      username: ['', [Validators.required, Validators.minLength(3)]],
      country: ['', [Validators.required]],
      role: ['', [Validators.required]],
      institution: ['', [Validators.required, Validators.minLength(3)]],
      agreeTerms: [false, [Validators.requiredTrue]],
    }, {
      validators: this.passwordMatchValidator.bind(this)
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });

    this.resetPasswordForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    }, {
      validators: this.passwordMatchValidator.bind(this)
    });
  }

  private passwordMatchValidator(group: FormGroup): any {
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

  // ========== LOGIN FLOW ==========
  onLogin(): void {
    this.submitted.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.loginForm.invalid) {
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
      next: () => {
        this.loadingState.set(false);
        this.successMessage.set('Login successful! Redirecting to dashboard...');
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

  onVerifyLoginOtp(): void {
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
    otp = otp.replace(/\s/g, '').trim();

    console.log('Verifying Login OTP for email:', email);

    this.authService.verifyEmail(email, otp).subscribe({
      next: (response) => {
        console.log('Login OTP verified successfully:', response);
        this.loadingState.set(false);
        this.successMessage.set('Email verified! Redirecting to dashboard...');
        this.otpForm.reset();
        this.submitted.set(false);
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1000);
      },
      error: (error) => {
        console.error('Login OTP verification failed:', error);
        this.loadingState.set(false);
        this.submitted.set(false);
        this.errorMessage.set(error.error?.message || error.message || 'OTP verification failed.');
      },
    });
  }

  // ========== SIGNUP FLOW ==========
  onSignUp(): void {
    this.submitted.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.signUpForm.invalid) {
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
      next: () => {
        this.loadingState.set(false);
        this.successMessage.set('Account created! OTP sent to your email. Please verify to activate.');
        this.authStep.set('signup-otp');
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

  onVerifySignUpOtp(): void {
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
    otp = otp.replace(/\s/g, '').trim();
    
    console.log('Verifying SignUp OTP for email:', email);

    this.authService.verifyEmail(email, otp).subscribe({
      next: (response) => {
        console.log('SignUp OTP verified successfully:', response);
        this.loadingState.set(false);
        this.successMessage.set('Email verified! Your account is now active. Redirecting to login...');
        this.otpForm.reset();
        this.submitted.set(false);
        setTimeout(() => {
          this.authStep.set('login');
          this.resetAllForms();
        }, 2000);
      },
      error: (error) => {
        console.error('SignUp OTP verification failed:', error);
        this.loadingState.set(false);
        this.submitted.set(false);
        this.errorMessage.set(error.error?.message || error.message || 'OTP verification failed.');
      },
    });
  }

  // ========== FORGOT PASSWORD FLOW ==========
  onForgotPasswordClick(): void {
    this.authStep.set('forgot-password');
    this.resetAllMessages();
    this.forgotPasswordForm.reset();
    this.submitted.set(false);
  }

  onForgotPassword(): void {
    this.submitted.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.forgotPasswordForm.invalid) {
      Object.keys(this.forgotPasswordForm.controls).forEach(key => {
        this.forgotPasswordForm.get(key)?.markAsTouched();
      });
      this.errorMessage.set('Please enter a valid email address.');
      return;
    }

    this.loadingState.set(true);
    const { email } = this.forgotPasswordForm.value;
    this.userEmailForOtp.set(email);

    this.authService.forgotPassword(email).subscribe({
      next: () => {
        this.loadingState.set(false);
        this.successMessage.set('OTP sent to your email. Enter the code and your new password below.');
        this.authStep.set('reset-password');
        this.resetPasswordForm.reset();
        this.submitted.set(false);
      },
      error: (error) => {
        this.loadingState.set(false);
        this.submitted.set(false);
        this.errorMessage.set(error.message || 'Failed to process forgot password request.');
      },
    });
  }

  onVerifyForgotPasswordOtp(): void {
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
    otp = otp.replace(/\s/g, '').trim();

    console.log('Verifying Forgot Password OTP for email:', email);

    this.authService.verifyForgotPasswordOtp(email, otp).subscribe({
      next: (response) => {
        console.log('Forgot Password OTP verified successfully:', response);
        this.verifiedOtp.set(otp); // Save verified OTP for reset call
        this.loadingState.set(false);
        this.successMessage.set('OTP verified! Please set your new password.');
        this.authStep.set('reset-password');
        this.otpForm.reset();
        this.resetPasswordForm.reset();
        this.submitted.set(false);
      },
      error: (error) => {
        console.error('Forgot Password OTP verification failed:', error);
        this.loadingState.set(false);
        this.submitted.set(false);
        this.errorMessage.set(error.error?.message || error.message || 'OTP verification failed.');
      },
    });
  }

  onResetPassword(): void {
    this.submitted.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.resetPasswordForm.invalid) {
      Object.keys(this.resetPasswordForm.controls).forEach(key => {
        this.resetPasswordForm.get(key)?.markAsTouched();
      });
      this.errorMessage.set('Please fill in all fields correctly.');
      return;
    }

    this.loadingState.set(true);
    const { otp, password: newPassword } = this.resetPasswordForm.value;
    const email = this.userEmailForOtp();
    const cleanOtp = otp.replace(/\s/g, '').trim();

    this.authService.resetPassword(email, cleanOtp, newPassword).subscribe({
      next: () => {
        this.loadingState.set(false);
        this.successMessage.set('Password reset successfully! Redirecting to login...');
        this.resetPasswordForm.reset();
        this.submitted.set(false);
        setTimeout(() => {
          this.authStep.set('login');
          this.resetAllForms();
        }, 1500);
      },
      error: (error) => {
        this.loadingState.set(false);
        this.submitted.set(false);
        this.errorMessage.set(error.error?.message || error.message || 'Failed to reset password.');
      },
    });
  }

  // ========== OTP RESEND ==========
  onResendOtp(): void {
    if (this.otpResendCooldown() > 0) {
      this.errorMessage.set(`Please wait ${this.otpResendCooldown()}s before requesting another OTP`);
      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');
    this.loadingState.set(true);
    const email = this.userEmailForOtp();

    this.authService.resendOtp(email).subscribe({
      next: () => {
        this.loadingState.set(false);
        this.successMessage.set('OTP resent to your email. Check your inbox.');
        this.otpForm.reset();
        this.startResendCooldown();
      },
      error: (error) => {
        this.loadingState.set(false);
        this.errorMessage.set(error.message || 'Failed to resend OTP.');
      },
    });
  }

  private startResendCooldown(): void {
    let countdown = 120;
    this.otpResendCooldown.set(countdown);
    
    if (this.otpResendTimer) clearInterval(this.otpResendTimer);

    this.otpResendTimer = setInterval(() => {
      countdown--;
      this.otpResendCooldown.set(countdown);
      
      if (countdown <= 0) {
        clearInterval(this.otpResendTimer);
        this.otpResendCooldown.set(0);
      }
    }, 1000);
  }

  // ========== NAVIGATION ==========
  goBackToLogin(): void {
    this.authStep.set('login');
    this.resetAllForms();
  }

  toggleAuthMode(): void {
    this.authStep.set(this.authStep() === 'login' ? 'signup' : 'login');
    this.resetAllForms();
  }

  // ========== HELPER METHODS ==========
  private resetAllForms(): void {
    this.loginForm.reset();
    this.signUpForm.reset();
    this.otpForm.reset();
    this.forgotPasswordForm.reset();
    this.resetPasswordForm.reset();
    this.submitted.set(false);
    this.resetAllMessages();
    this.userEmailForOtp.set('');
  }

  private resetAllMessages(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  // ========== ERROR MESSAGES ==========
  getLoginErrorMessage(fieldName: string): string {
    const control = this.loginForm.get(fieldName);
    if (control?.hasError('required')) return `${fieldName} is required`;
    if (control?.hasError('email')) return 'Please enter a valid email';
    if (control?.hasError('minlength')) return `${fieldName} must be at least ${control.errors?.['minlength'].requiredLength} characters`;
    return '';
  }

  getSignUpErrorMessage(fieldName: string): string {
    const control = this.signUpForm.get(fieldName);
    if (!control) return '';
    if (control?.hasError('required')) return `${fieldName} is required`;
    if (control?.hasError('email')) return 'Please enter a valid email';
    if (control?.hasError('minlength')) return `${fieldName} must be at least ${control.errors?.['minlength'].requiredLength} characters`;
    if (control?.hasError('passwordMismatch')) return 'Passwords do not match';
    if (control?.hasError('requiredTrue')) return 'You must agree to the terms and conditions';
    return '';
  }

  getOtpErrorMessage(fieldName: string): string {
    const control = this.otpForm.get(fieldName);
    if (control?.hasError('required')) return 'OTP is required';
    if (control?.hasError('minlength')) return `OTP must be at least ${control.errors?.['minlength'].requiredLength} characters`;
    return '';
  }

  getForgotPasswordErrorMessage(fieldName: string): string {
    const control = this.forgotPasswordForm.get(fieldName);
    if (control?.hasError('required')) return 'Email is required';
    if (control?.hasError('email')) return 'Please enter a valid email';
    return '';
  }

  getResetPasswordErrorMessage(fieldName: string): string {
    const control = this.resetPasswordForm.get(fieldName);
    if (!control) return '';
    if (control?.hasError('required')) {
      if (fieldName === 'otp') return 'Verification code is required';
      return `${fieldName} is required`;
    }
    if (control?.hasError('minlength')) {
      if (fieldName === 'otp') return `Code must be at least ${control.errors?.['minlength'].requiredLength} digits`;
      return `Password must be at least ${control.errors?.['minlength'].requiredLength} characters`;
    }
    if (control?.hasError('passwordMismatch')) return 'Passwords do not match';
    return '';
  }
}
