import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface RegisterRequest {
  email: string;
  password: string;
  role: 'user' | 'admin';
  enable2FA: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private apiUrl = environment.apiUrl;
  private tokenKey = 'auth_token';
  
  // Signals para estado de autenticação
  isAuthenticated = signal<boolean>(this.hasToken());
  currentUser = signal<any>(null);
  
  constructor() {
    this.loadUserFromToken();
  }
  
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, data)
      .pipe(
        tap(response => this.handleAuthSuccess(response)),
        catchError(error => this.handleError(error))
      );
  }
  
  login(data: LoginRequest): Observable<AuthResponse> {
    console.log('Login request:', data);
    console.log('API URL:', `${this.apiUrl}/auth/login`);
    
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, data)
      .pipe(
        tap(response => {
          console.log('Login successful:', response);
          this.handleAuthSuccess(response);
        }),
        catchError(error => {
          console.error('Login error:', error);
          return this.handleError(error);
        })
      );
  }
  
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
    this.router.navigate(['/auth/login']);
  }
  
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
  
  private hasToken(): boolean {
    return !!this.getToken();
  }
  
  private handleAuthSuccess(response: AuthResponse): void {
    localStorage.setItem(this.tokenKey, response.token);
    this.isAuthenticated.set(true);
    this.currentUser.set(response.user);
  }
  
  private loadUserFromToken(): void {
    const token = this.getToken();
    if (token) {
      try {
        // Opcionalmente, decodificar o token JWT para obter informações do usuário
        // ou fazer uma chamada para /auth/me
        this.isAuthenticated.set(true);
        this.getUserInfo().subscribe();
      } catch (e) {
        console.error('Error loading user from token:', e);
        this.logout();
      }
    }
  }
  
  getUserInfo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/auth/me`)
      .pipe(
        tap(user => this.currentUser.set(user)),
        catchError(error => {
          console.error('Error getting user info:', error);
          if (error.status === 401) {
            this.logout();
          }
          return throwError(() => error);
        })
      );
  }
  
  private handleError(error: any): Observable<never> {
    let errorMessage = 'Ocorreu um erro desconhecido';
    
    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else if (error instanceof HttpErrorResponse) {
      // Erro do lado do servidor
      switch (error.status) {
        case 401:
          errorMessage = 'Credenciais inválidas. Verifique seu e-mail e senha.';
          break;
        case 403:
          errorMessage = 'Acesso negado.';
          break;
        case 404:
          errorMessage = 'Serviço não encontrado.';
          break;
        case 500:
          errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
          break;
        default:
          errorMessage = error.error?.message || 'Ocorreu um erro na comunicação com o servidor.';
      }
    }
    
    console.error('Auth error:', errorMessage);
    return throwError(() => errorMessage);
  }
}