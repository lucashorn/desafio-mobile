import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  
  @Input() headerName?: string;

  constructor(private authService: AuthService) { }

  logout() {
    this.authService.logout();
  }
}
