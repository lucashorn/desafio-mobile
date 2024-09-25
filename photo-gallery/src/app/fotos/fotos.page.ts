import { Component } from '@angular/core';
import { PhotoService, UserPhoto } from '../services/photo.service';

@Component({
  selector: 'app-fotos',
  templateUrl: 'fotos.page.html',
  styleUrls: ['fotos.page.scss']
})
export class FotosPage {
  public newComment: { [key: number]: string } = {};
  public likes: { [key: number]: number } = {};
  public showComments: { [key: number]: boolean } = {}; 

  constructor(public photoService: PhotoService) {}

  public showActionSheet(photo: UserPhoto, position: number) {
    this.photoService.showActionSheet(photo, position);
  }

  // Função para adicionar comentário
  public addComment(position: number) {
    if (!this.newComment[position]) return; 
  
    if (!this.photoService.photos[position].comments) {
      this.photoService.photos[position].comments = [];
    }
  
    this.photoService.photos[position].comments!.push(this.newComment[position]);
  
    this.newComment[position] = '';
  }
  

  public likePhoto(position: number) {
    if (!this.likes[position]) {
      this.likes[position] = 0;
    }

    this.likes[position]++;
  }

  public toggleComments(position: number) {
    this.showComments[position] = !this.showComments[position];
  }
}
