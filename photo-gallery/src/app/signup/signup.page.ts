import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PhotoService } from '../services/photo.service';
import { ToastController } from '@ionic/angular';
import { SupabaseService, UserRegister } from '../services/supabase.service';
import { Photo } from '@capacitor/camera';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage {
  user: UserRegister = {
    username: '',
    password: '',
    apelido: '',
  }
  userPhoto: Photo | undefined;

  constructor(
    private router: Router, 
    private photoService: PhotoService,    
    private toastController: ToastController,
    private supabase: SupabaseService
  ) {}

  async addPhotoToGallery() {
    this.userPhoto = await this.photoService.captureProfilePhoto();
  }
  

  async register() {
    if (this.user.username && this.user.password && this.user.apelido) {
      if(this.userPhoto){
        const filename = `${this.user.username.split('@')[0]}.${this.userPhoto.format}`
        this.user.profileImage = filename + Date.now().toString();

        await this.supabase.signUp(this.user.username, this.user.password, this.user.apelido, this.user.profileImage)
        await this.supabase.uploadProfileImageStorage(this.userPhoto, filename)
      } else{
        await this.supabase.signUp(this.user.username, this.user.password, this.user.apelido)
      }
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
