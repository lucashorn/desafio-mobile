import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PhotoService } from '../services/photo.service';
import { ToastController } from '@ionic/angular';
import { SupabaseService, User } from '../services/supabase.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {
  user: User = {
    username: '',
    password: '',
    apelido: ''
  }

  constructor(
    private router: Router, 
    private photoService: PhotoService,    
    private toastController: ToastController,
    private supabase: SupabaseService
  ) {}

  async addPhotoToGallery() {
    try {
      const photo = await this.photoService.capturePhoto(false);
      const base64Image = await this.photoService.readAsBase64(photo); // Agora, o tipo correto
      this.user.profileImage = base64Image; // Armazena em base64
    } catch (error) {
      this.showAlert('Erro ao capturar a foto.');
    }
  }
  

  async register() {
    if (this.user.username && this.user.password && this.user.apelido) {
      const response = await this.supabase.signUp(this.user.username, this.user.password, this.user.apelido)

      console.log(response)

       // Limpa os campos do formulário
       this.user.username = '';
       this.user.password = '';
       this.user.apelido = '';
       this.user.profileImage = undefined;
 
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
        this.user.profileImage = reader.result as string;
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
