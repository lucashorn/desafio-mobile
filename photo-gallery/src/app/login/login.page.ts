import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  username: string = '';
  password: string = '';

  constructor(
    private router: Router, 
    private toastController: ToastController,
    private supabase: SupabaseService
  ) {}

  async login() {
    if (this.username && this.password) {
      const response = await this.supabase.signIn(this.username, this.password)
      
      if (!response.error) {
        this.router.navigate(['/menu']);
      } else {
        this.presentToast('Usuário ou senha incorretos!');
      }
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
