import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-menu',
  templateUrl: 'Menu.page.html',
  styleUrls: ['Menu.page.scss']
})
export class MenuPage {
  constructor(
    private authService: AuthService,
  ) {}

  logout() {
    this.authService.logout();
  }
}
