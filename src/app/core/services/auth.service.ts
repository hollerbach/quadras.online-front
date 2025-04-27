// src/app/core/services/auth.service.ts

import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ToastrService } from 'ngx-toastr';

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
  private toastr = inject(ToastrService);
  
  private _apiUrl = environment.apiUrl;
  
  // Signals para estado de autenticação
  private _isAuthenticated = signal<boolean>(false);
  currentUser = signal<any>(null);
  
  // Public method to get the API URL
  getApiUrl(): string {
    return this._apiUrl;
  }
  
  // Método para verificar autenticação
  isAuthenticated(): boolean {
    return this._isAuthenticated();
  }
  
  constructor() {
    this.checkAuthStatus();
  }
  
  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this._apiUrl}/auth/register`, data, {
      withCredentials: true // Important for cookies to be sent/received
    }).pipe(
      tap(response => {
        this.handleAuthSuccess(response);
        this.toastr.success(
          'Sua conta foi criada com sucesso!', 
          'Registro Concluído',
          {
            timeOut: 5000,
            progressBar: true,
            closeButton: true
          }
        );
      }),
      catchError(error => this.handleError(error))
    );
  }
  
  login(data: LoginRequest): Observable<AuthResponse> {
    console.log('Login request:', data);
    console.log('API URL:', `${this._apiUrl}/auth/login`);
    
    return this.http.post<AuthResponse>(`${this._apiUrl}/auth/login`, data, {
      withCredentials: true // Important for cookies to be sent/received
    }).pipe(
      tap(response => {
        console.log('Login successful:', response);
        this.handleAuthSuccess(response);
        this.toastr.success(
          'Login efetuado com sucesso!', 
          'Bem-vindo',
          {
            timeOut: 3000,
            progressBar: true
          }
        );
      }),
      catchError(error => {
        console.error('Login error:', error);
        return this.handleError(error);
      })
    );
  }
  
  logout(): void {
    // Call logout endpoint to clear the cookie on the server
    this.http.post(`${this._apiUrl}/auth/logout`, {}, {
      withCredentials: true
    }).subscribe({
      next: () => {
        this._isAuthenticated.set(false);
        this.currentUser.set(null);
        this.router.navigate(['/auth/login']);
      },
      error: () => {
        // Even if the server call fails, clear the local state
        this._isAuthenticated.set(false);
        this.currentUser.set(null);
        this.router.navigate(['/auth/login']);
      }
    });
  }
  
  // Check if the user is authenticated by validating the cookie with the server
  checkAuthStatus(): void {
    this.http.get(`${this._apiUrl}/auth/status`, {
      withCredentials: true
    }).subscribe({
      next: () => {
        this._isAuthenticated.set(true);
        // Get user data
        this.getUserInfo().subscribe();
      },
      error: () => {
        this._isAuthenticated.set(false);
        this.currentUser.set(null);
      }
    });
  }
  
  private handleAuthSuccess(response: AuthResponse): void {
    this._isAuthenticated.set(true);
    this.currentUser.set(response.user);
  }
  
  getUserInfo(): Observable<any> {
    return this.http.get(`${this._apiUrl}/users/me`, {
      withCredentials: true
    }).pipe(
      tap(user => {
        console.log('User info retrieved:', user);
        this.currentUser.set(user);
      }),
      catchError(error => {
        console.error('Error getting user info:', error);
        if (error.status === 401) {
          // Token inválido ou expirado, fazer logout
          this._isAuthenticated.set(false);
          this.currentUser.set(null);
          this.router.navigate(['/auth/login']);
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
        case 422:
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else {
            errorMessage = 'Erro de validação no formulário.';
          }
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