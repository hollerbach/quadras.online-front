import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { EmailValidator } from '../../shared/validators/email.validator';
import { AuthService, RegisterRequest } from '../../services/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, ReactiveFormsModule, FormsModule],
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
  showPassword = false;
  
  // Signals para gerenciar estado da UI
  isLoading = signal(false);
  errorMessage = signal('');
  
  constructor() {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, EmailValidator.isValid]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
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
    this.errorMessage.set('');
    
    if (this.signupForm.valid) {
      this.isLoading.set(true);
      
      const registerData: RegisterRequest = {
        email: this.signupForm.value.email,
        password: this.signupForm.value.password,
        role: 'user', // Por padrão, todos os novos registros são usuários comuns
        enable2FA: false // Por padrão, 2FA está desativado no registro inicial
      };
      
      this.authService.register(registerData)
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
          next: () => {
            // Redireciona para a página inicial ou página específica após registro
            const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
            this.router.navigate([returnUrl]);
          },
          error: (error) => {
            this.errorMessage.set(typeof error === 'string' 
              ? error 
              : 'Ocorreu um erro ao criar sua conta. Por favor, tente novamente.');
          }
        });
    }
  }
  
  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  // Getters para facilitar o acesso aos controles do formulário no template
  get nameControl() { return this.signupForm.get('name'); }
  get lastNameControl() { return this.signupForm.get('lastName'); }
  get emailControl() { return this.signupForm.get('email'); }
  get passwordControl() { return this.signupForm.get('password'); }
  get confirmPasswordControl() { return this.signupForm.get('confirmPassword'); }
  get termsControl() { return this.signupForm.get('terms'); }

  // Helpers para verificação de erros
  hasError(controlName: string, errorType: string): boolean {
    const control = this.signupForm.get(controlName);
    return (this.formSubmitted || (control?.touched || control?.dirty)) && 
           control?.hasError(errorType) || false;
  }
  
  loginWith(provider: string) {
    console.log(`Login com ${provider}`);
    // Implementação futura para autenticação com provedores externos
  }
}