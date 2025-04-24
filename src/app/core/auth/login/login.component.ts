import { Component, signal, OnInit } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService, LoginRequest } from '../../../core/services/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, CommonModule, ReactiveFormsModule, FormsModule],
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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.loginForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Check if redirected due to session expiration
    const sessionExpired = this.route.snapshot.queryParams['sessionExpired'];
    if (sessionExpired) {
      this.error.set('Sua sessão expirou. Por favor, faça login novamente.');
    }
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

    const loginData: LoginRequest = {
      email: this.storedEmail(),
      password: this.loginForm.value.password
    };

    this.authService.login(loginData)
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: (response) => {
          // Redireciona para URL de retorno ou para home
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
          this.router.navigate([returnUrl]);
        },
        error: (error) => {
          console.error('Login error:', error);
          this.error.set(typeof error === 'string' 
            ? error 
            : 'Erro ao fazer login. Verifique suas credenciais.');
        }
      });
  }

  loginWith(provider: 'google' | 'microsoft') {
    console.log(`Redirecionando para login com ${provider}`);
    // Implementação futura para autenticação com provedores externos
  }

  backToEmail() {
    this.step.set('email');
    this.loginForm.reset();
  }
}