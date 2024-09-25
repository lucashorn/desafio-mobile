import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {
  username: string = '';
  password: string = '';

  constructor(private router: Router) {}

  register() {
    if (this.username && this.password) {
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const userExists = existingUsers.some((user: any) => user.username === this.username);

      if (userExists) {
        alert('Usuário já existe!');
        return;
      }

      existingUsers.push({ username: this.username, password: this.password });
      localStorage.setItem('users', JSON.stringify(existingUsers));
      this.router.navigate(['/login']);
    } else {
      alert('Por favor, preencha todos os campos.');
    }
  }
}
