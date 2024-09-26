import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PhotoService } from '../services/photo.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {
  username: string = '';
  password: string = '';
  apelido: string = '';
  profileImage?: string;

  constructor(
    private router: Router, 
    private photoService: PhotoService,
    private toastController: ToastController
  ) {}

  async addPhotoToGallery() {
    try {
      const photo = await this.photoService.capturePhoto(false);
      this.profileImage = photo.webviewPath;
    } catch (error) {
      this.showAlert('Erro ao capturar a foto.');
    }
  }

  async register() {
    if (this.username && this.password && this.apelido) {
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const userExists = existingUsers.some((user: any) => user.username === this.username);

      if (userExists) {
        await this.presentToast('Usuário já existe!', 'danger');
        return;
      }

      existingUsers.push({ username: this.username, password: this.password, profileImage: this.profileImage });
      localStorage.setItem('users', JSON.stringify(existingUsers));

       // Limpa os campos do formulário
       this.username = '';
       this.password = '';
       this.apelido = '';
       this.profileImage = undefined;
 
       await this.presentToast('Cadastro realizado com sucesso!');

      this.router.navigate(['/login']);
    } else {
      await this.presentToast('Por favor, preencha todos os campos.', 'danger');
    }
  }

  private async presentToast(message: string, color: string = 'success') {
    const toast = await this.toastController.create({
      message,
      duration: 4000,
      position: 'top',
      color: color,
    });
    await toast.present();
  }

  async handleImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImage = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  private showAlert(message: string) {
    // Função para exibir alertas na tela
    alert(message);
  }
}
