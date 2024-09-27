import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-Menu',
  templateUrl: 'Menu.page.html',
  styleUrls: ['Menu.page.scss']
})
export class MenuPage {

  user: any;
  savedImage: any;
  
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.userService.getUser().subscribe(user => {      
      this.user = user;
      this.updateProfileImage();
    });
  }

  private updateProfileImage() {
    this.savedImage = this.user?.profileImage || 'assets/icon/user.png';
  }

  logout() {
    this.authService.logout();
  }
}
