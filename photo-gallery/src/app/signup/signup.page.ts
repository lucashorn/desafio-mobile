import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PhotoService } from '../services/photo.service';

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

  constructor(private router: Router, private photoService: PhotoService) {}

  async addPhotoToGallery() {
    try {
      const photo = await this.photoService.capturePhoto(false);
      this.profileImage = photo.webviewPath;
    } catch (error) {
      this.showAlert('Erro ao capturar a foto.');
    }
  }

  async register() {
    if (this.username && this.password) {
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const userExists = existingUsers.some((user: any) => user.username === this.username);

      if (userExists) {
        this.showAlert('Usuário já existe!');
        return;
      }

      existingUsers.push({ username: this.username, password: this.password, profileImage: this.profileImage });
      localStorage.setItem('users', JSON.stringify(existingUsers));
      this.router.navigate(['/login']);
    } else {
      this.showAlert('Por favor, preencha todos os campos.');
    }
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
