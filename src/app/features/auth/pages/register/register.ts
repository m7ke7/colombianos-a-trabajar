import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrls: ['./register.css']
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  userData = {
    name: '',
    email: '',
    password: ''
  };

  errorMessage: string = '';

  onRegister(): void {
    this.authService.register(this.userData).subscribe({
      next: () => {
        alert('Registro exitoso. ¡Ahora puedes iniciar sesión!');
        this.router.navigate(['/login']);
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'Error al registrar el usuario.';
      }
    });
  }
}