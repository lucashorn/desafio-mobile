import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private router: Router,
    private userService: UserService) {}

  login(username: string, password: string): boolean {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.username === username && u.password === password);
    if (user) {
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      this.userService.updateUser(user);
      return true;
    }

    return false;
  }

  getLoggedInUser() {
    return JSON.parse(localStorage.getItem('loggedInUser') || '{}');
  }

  logout() {
    localStorage.removeItem('loggedIn');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('loggedInUser');
  }
}
