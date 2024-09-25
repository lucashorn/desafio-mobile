import { Component } from '@angular/core';
import { PhotoService, UserPhoto } from '../services/photo.service';

@Component({
  selector: 'app-fotos',
  templateUrl: 'fotos.page.html',
  styleUrls: ['fotos.page.scss']
})
export class FotosPage {
  public likes: { [key: number]: number } = {};
  public showComments: { [key: number]: boolean } = {};
  public newComment: { [key: number]: string } = {};

  constructor(public photoService: PhotoService) {
    this.photoService.photos.forEach((photo, index) => {
      this.likes[index] = 0;
      this.showComments[index] = false;
      this.newComment[index] = '';
    });
  }

  public showActionSheet(photo: UserPhoto, position: number) {
    this.photoService.showActionSheet(photo, position);
  }

  public async toggleLike(position: number) {
    const photo = this.photoService.photos[position];
    console.log('Photo :', photo);
    console.log('position :', position);
    console.log('liked :', photo.liked);
    console.log('likes :', photo.likes);

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
}
