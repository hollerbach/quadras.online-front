import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-recover',
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './recover.component.html',
  styleUrl: './recover.component.css',
})
export class RecoverComponent implements OnInit {
  forgotPasswordForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get emailControl() {
    return this.forgotPasswordForm.get('email')!;
  }

  onSubmit() {
    if (this.forgotPasswordForm.valid) {
      console.log('Dados do formulário:', this.forgotPasswordForm.value);
    }
  }
}