import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    if (this.username && this.password) {
      const success = this.authService.login(this.username, this.password);
      if (success) {
        localStorage.setItem('loggedIn', 'true');
        this.router.navigate(['/menu']);
      } else {
        alert('Usuário ou senha incorretos!');
      }
    } else {
      alert('Por favor, preencha todos os campos.');
    }
  }

  navigateToSignup() {
    this.router.navigate(['/signup']);
  }
}
