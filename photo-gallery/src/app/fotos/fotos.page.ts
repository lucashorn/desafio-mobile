import { Component } from '@angular/core';
import { PhotoService, UserPhoto } from '../services/photo.service';

@Component({
  selector: 'app-fotos',
  templateUrl: 'fotos.page.html',
  styleUrls: ['fotos.page.scss']
})
export class FotosPage {
  public newComment: { [key: number]: string } = {};  // Armazena o novo comentário para cada foto
  public likes: { [key: number]: number } = {}; // Armazena o número de likes para cada foto

  constructor(public photoService: PhotoService) {}

  public showActionSheet(photo: UserPhoto, position: number) {
    this.photoService.showActionSheet(photo, position);
  }

  // Função para adicionar comentário
  public addComment(position: number) {
    if (!this.newComment[position]) return; // Verifica se há um novo comentário a ser adicionado
  
    // Verifica se o array de comentários existe, caso contrário, inicializa-o como um array vazio
    if (!this.photoService.photos[position].comments) {
      this.photoService.photos[position].comments = [];
    }
  
    // Adiciona o novo comentário ao array de comentários da foto
    this.photoService.photos[position].comments!.push(this.newComment[position]);
  
    // Limpa o campo de comentário
    this.newComment[position] = '';
  }
  

  // Função para dar like
  public likePhoto(position: number) {
    if (!this.likes[position]) {
      this.likes[position] = 0;
    }

    // Incrementa o contador de likes
    this.likes[position]++;
  }
}
