import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  username: string = '';
  password: string = '';

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private toastController: ToastController
  ) {}

  login() {
    if (this.username && this.password) {
      const success = this.authService.login(this.username, this.password);
      if (success) {
        localStorage.setItem('loggedIn', 'true');
        this.router.navigate(['/menu']);
      } else {
        this.presentToast('Usuário ou senha incorretos!');      }
    } else {
      this.presentToast('Por favor, preencha todos os campos.');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 4000,
      position: 'top',
      color: 'danger',
    });
    toast.present();
  }

  navigateToSignup() {
    this.router.navigate(['/signup']);
  }
}
