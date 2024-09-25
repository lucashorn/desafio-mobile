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

  public toggleLike(position: number) {
    if (this.likes[position]) {
      this.likes[position] = 0;
    } else {
      this.likes[position] = 1;
    }
  }

  public toggleComments(position: number) {
    this.showComments[position] = !this.showComments[position];
  }

  public addComment(position: number) {
    const photo = this.photoService.photos[position];
    
    if (!photo.comments || !Array.isArray(photo.comments)) {
      photo.comments = [];
    }

    if (this.newComment[position]) {
      photo.comments.push(this.newComment[position]);

      this.newComment[position] = '';
    }
  }
}
