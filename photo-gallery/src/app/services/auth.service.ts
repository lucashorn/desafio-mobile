import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private router: Router,
    private userService: UserService,
    private supabase: SupabaseService
  ) {}

  logout() {
    this.supabase.signOut()
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('sb-slbespgvkdhwxlqgbuvo-auth-token');
  }
}
