import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  credentials = {
    email: '',
    password: ''
  };

  errorMessage: string = '';

  onLogin(): void {
    this.authService.login(this.credentials).subscribe({
      next: () => {
        // Redirige al panel o formulario de ofertas tras un inicio de sesión exitoso
        this.router.navigate(['/admin/post-job']);
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'Error al iniciar sesión. Revisa tus credenciales.';
      }
    });
  }
}