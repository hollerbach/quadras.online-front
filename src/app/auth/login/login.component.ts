import { Component, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  encapsulation: ViewEncapsulation.None // Desabilita o encapsulamento
})
export class LoginComponent {
  showPassword = false;

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }
}
