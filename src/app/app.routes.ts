import { Routes } from '@angular/router';
import { LoginComponent } from './core/auth/login/login.component';
import { RecoverComponent } from './core/auth/recover/recover.component';
import { SigninComponent } from './core/auth/signin/signin.component';
import { HomeComponent } from './home/home.component';
import { authGuard, noAuthGuard } from './core/services/auth.guard';

export const routes: Routes = [
  // Rotas de autenticação - acessíveis apenas para usuários não logados
  {
    path: 'auth/login',
    component: LoginComponent,
    canActivate: [noAuthGuard]
  },
  {
    path: 'auth/recover',
    component: RecoverComponent,
    canActivate: [noAuthGuard]
  },
  {
    path: 'auth/signin',
    component: SigninComponent,
    canActivate: [noAuthGuard]
  },

  // Rotas protegidas - requerem autenticação
  // Exemplo para futuras rotas protegidas:
  // {
  //   path: 'dashboard',
  //   loadComponent: () => import('./dashboard/dashboard.component').then(c => c.DashboardComponent),
  //   canActivate: [authGuard]
  // },

  // Rotas públicas
  {
    path: 'home',
    component: HomeComponent
  },

  // Redirecionamentos
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];