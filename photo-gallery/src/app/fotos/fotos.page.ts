import { Component, OnInit } from '@angular/core';
import { PhotoService, UserPhoto } from '../services/photo.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-fotos',
  templateUrl: 'fotos.page.html',
  styleUrls: ['fotos.page.scss']
})
export class FotosPage implements OnInit {
  public likes: { [key: number]: number } = {};
  public showComments: { [key: number]: boolean } = {};
  public newComment: { [key: number]: string } = {};
  user: any;
  savedImage: any;

  constructor(
    public photoService: PhotoService,
    private userService: UserService,
    private authService: AuthService,
  ) {
    this.photoService.photos.forEach((photo, index) => {
      this.likes[index] = 0;
      this.showComments[index] = false;
      this.newComment[index] = '';
    });
  }

  async ngOnInit() {
    console.log('init')
    await this.photoService.loadSaved();
    this.userService.getUser().subscribe(user => {      
      this.user = user;
      this.updateProfileImage();
    });
  }

  private updateProfileImage() {
    this.savedImage = this.user?.profileImage || 'assets/icon/user.png';
  }

  public showActionSheet(photo: UserPhoto, position: number) {
    this.photoService.showActionSheet(photo, position);
  }

  public async toggleLike(position: number) {
    const photo = this.photoService.photos[position];

    if (photo.likes === undefined) {
      photo.likes = 0;
      photo.liked = false;
    }
  
    if (photo.liked) {
      photo.likes -= 1;
    } else {
      photo.likes += 1;
    }
    photo.liked = !photo.liked;
  
    // Atualiza a foto no serviço
    await this.photoService.updatePhoto(photo);
  }

  public toggleComments(position: number) {
    this.showComments[position] = !this.showComments[position];
  }

  public async addComment(position: number) {
    const photo = this.photoService.photos[position];
  
    if (!photo.comments || !Array.isArray(photo.comments)) {
      photo.comments = [];
    }
  
    if (this.newComment[position]) {
      photo.comments.push(this.newComment[position]);
      this.newComment[position] = '';
  
      // Atualiza a foto no serviço
      await this.photoService.updatePhoto(photo);
    }
  }

  logout() {
    this.authService.logout();
  }
}
