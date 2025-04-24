// src/app/core/services/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastr = inject(ToastrService);
  
  const token = authService.getToken();
  
  // Adiciona o token de autenticação se disponível
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  return next(req).pipe(
    catchError(error => {
      // Verifica se é um erro de rede (Failed to fetch)
      if (error.status === 0) {
        toastr.error(
          'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.', 
          'Erro de Conexão', 
          { 
            timeOut: 5000,
            progressBar: true,
            closeButton: true
          }
        );
        return throwError(() => 'O servidor não está respondendo. Verifique sua conexão com a internet.');
      }
      
      // Tratamento específico para erro 401 (Não Autorizado)
      if (error.status === 401) {
        // Se for uma requisição para /auth/login, não exibimos a notificação
        // pois provavelmente é uma tentativa de login com credenciais inválidas
        if (!req.url.includes('/auth/login')) {
          // Mostrar mensagem de erro com toastr
          toastr.warning(
            'Sua sessão expirou ou as credenciais são inválidas. Por favor, faça login novamente.', 
            'Autenticação Necessária', 
            { 
              timeOut: 5000,
              progressBar: true,
              closeButton: true,
              positionClass: 'toast-top-center'
            }
          );
          
          // Limpar dados de autenticação
          authService.logout();
          
          // Redirecionar para a página de login com parâmetro para indicar sessão expirada
          router.navigate(['/auth/login'], { 
            queryParams: { 
              returnUrl: router.url,
              sessionExpired: true 
            } 
          });
        }
      }
      
      // Tratamento para erro 403 (Proibido/Sem permissão)
      if (error.status === 403) {
        toastr.error(
          'Você não tem permissão para acessar este recurso.', 
          'Acesso Negado', 
          { 
            timeOut: 5000,
            progressBar: true,
            closeButton: true
          }
        );
      }
      
      // Tratamento para erro 404 (Não encontrado)
      if (error.status === 404) {
        toastr.error(
          'O recurso solicitado não foi encontrado no servidor.', 
          'Recurso Não Encontrado', 
          { 
            timeOut: 5000,
            progressBar: true
          }
        );
      }
      
      // Tratamento para erros de validação (422)
      if (error.status === 422) {
        let mensagem = 'Existem erros de validação no formulário.';
        
        // Se o servidor retornar detalhes de validação, exibimos eles
        if (error.error && error.error.details) {
          mensagem = Object.values(error.error.details).join('<br>');
        }
        
        toastr.error(
          mensagem, 
          'Erro de Validação', 
          { 
            timeOut: 7000,
            progressBar: true,
            closeButton: true,
            enableHtml: true
          }
        );
      }
      
      // Tratamento para erro 500 (Erro interno do servidor)
      if (error.status >= 500) {
        toastr.error(
          'Ocorreu um erro interno no servidor. Nossa equipe técnica foi notificada.', 
          'Erro no Servidor', 
          { 
            timeOut: 5000,
            progressBar: true,
            closeButton: true
          }
        );
      }
      
      return throwError(() => error);
    })
  );
};