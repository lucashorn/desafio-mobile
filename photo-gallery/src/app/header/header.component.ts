import { UserService } from './../services/user.service';
import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit{
  
  @Input() headerName?: string;

  user: any;

  constructor(private authService: AuthService, private userService: UserService) { }

  ngOnInit(): void {
    this.user = this.userService.getUser();
  }

  logout() {
    this.authService.logout();
  }
}
