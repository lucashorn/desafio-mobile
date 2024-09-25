import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-Menu',
  templateUrl: 'Menu.page.html',
  styleUrls: ['Menu.page.scss']
})
export class MenuPage {

  constructor(private authService: AuthService) {}

  logout() {
    this.authService.logout();
  }
}
