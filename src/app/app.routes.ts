import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RecoverComponent } from './auth/recover/recover.component';
import { SigninComponent } from './auth/signin/signin.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';

export const routes: Routes = [
  { path: 'auth/login', component: LoginComponent },
  { path: 'auth/recover', component: RecoverComponent },
  { path: 'auth/signin', component: SigninComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' }, // Redireciona para login por padrão
  { path: '**', redirectTo: 'home' }                   // Redireciona para login caso a rota não exista
];