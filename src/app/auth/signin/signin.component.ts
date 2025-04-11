import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmailValidator } from '../../validators/email.validator';
import { AuthService, RegisterRequest } from '../../services/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  
  signupForm: FormGroup;
  formSubmitted = false;
  isLoading = false;
  errorMessage = '';
  
  constructor() {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, EmailValidator.isValid]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      enable2FA: [false],
      terms: [false, [Validators.requiredTrue]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (password === confirmPassword) {
      form.get('confirmPassword')?.setErrors(null);
      return null;
    } else {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
      return { passwordMismatch: true };
    }
  }

  onSubmit() {
    this.formSubmitted = true;
    this.errorMessage = '';
    
    if (this.signupForm.valid) {
      this.isLoading = true;
      
      const registerData: RegisterRequest = {
        email: this.signupForm.value.email,
        password: this.signupForm.value.password,
        role: 'user',
        enable2FA: this.signupForm.value.enable2FA || false
      };
      
      this.authService.register(registerData)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: () => {
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
            this.router.navigate([returnUrl]);
          },
          error: (error) => {
            this.errorMessage = typeof error === 'string' 
              ? error 
              : 'Ocorreu um erro ao criar sua conta. Por favor, tente novamente.';
          }
        });
    }
  }

  get nameControl() { return this.signupForm.get('name'); }
  get emailControl() { return this.signupForm.get('email'); }
  get passwordControl() { return this.signupForm.get('password'); }
  get confirmPasswordControl() { return this.signupForm.get('confirmPassword'); }
  get termsControl() { return this.signupForm.get('terms'); }

  hasEmailError(errorType: string): boolean {
    return this.formSubmitted && 
           this.emailControl?.hasError(errorType) || false;
  }
  
  hasPasswordError(errorType: string): boolean {
    return this.formSubmitted && 
           this.passwordControl?.hasError(errorType) || false;
  }
}