import { Component, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  step = signal<'email' | 'password'>('email');
  submitting = signal(false);
  error = signal<string | null>(null);
  showPassword = false;

  loginForm!: FormGroup;
  forgotPasswordForm!: FormGroup;
  storedEmail = signal<string>('');

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.loginForm = new FormGroup({
      email: new FormControl(''),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  get emailControl() {
    return this.forgotPasswordForm.get('email')!;
  }

  continueWithEmail(): void {
    if (this.forgotPasswordForm.invalid) return;

    this.storedEmail.set(this.forgotPasswordForm.value.email!);
    this.error.set(null);
    this.step.set('password');
  }

  async loginWithPassword(): Promise<void> {
    if (this.loginForm.invalid) return;

    this.submitting.set(true);
    this.error.set(null);

    try {
      const credentials = {
        email: this.storedEmail(),
        password: this.loginForm.value.password
      };
      // Simulação de login
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Login realizado com:', credentials);
    } catch (e) {
      this.error.set('Erro ao fazer login. Verifique sua senha.');
    } finally {
      this.submitting.set(false);
    }
  }

  loginWith(provider: 'google' | 'microsoft') {
    console.log(`Redirecionando para login com ${provider}`);
    // Aqui iria lógica real de redirecionamento OAuth
  }

  backToEmail() {
    this.step.set('email');
    this.loginForm.reset();
  }

  onSubmitForgotPassword() {
    if (this.forgotPasswordForm.valid) {
      console.log('Dados do formulário:', this.forgotPasswordForm.value);
    }
  }
}
