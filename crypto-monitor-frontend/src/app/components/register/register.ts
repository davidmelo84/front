import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const userData = {
        username: this.registerForm.value.username,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password
      };

      this.authService.register(userData).subscribe({
        next: () => {
          this.successMessage = 'Registro realizado com sucesso! Redirecionando para login...';
          this.loading = false;
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (error) => {
          this.errorMessage = error.error?.message || 'Erro ao registrar usuário. Tente novamente.';
          this.loading = false;
        }
      });
    }
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field && field.touched && field.errors) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} é obrigatório`;
      if (field.errors['email']) return 'E-mail inválido';
      if (field.errors['minlength']) {
        return `${this.getFieldLabel(fieldName)} deve ter pelo menos ${field.errors['minlength'].requiredLength} caracteres`;
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      username: 'Nome de usuário',
      email: 'E-mail',
      password: 'Senha',
      confirmPassword: 'Confirmação de senha'
    };
    return labels[fieldName] || fieldName;
  }
}
