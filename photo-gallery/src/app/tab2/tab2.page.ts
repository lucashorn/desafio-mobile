import { Component } from '@angular/core';
import { PhotoService } from '../services/photo.service'; // Ajuste o caminho conforme necessário

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  constructor(public photoService: PhotoService) {}

  // Método para adicionar uma nova foto à galeria
  addPhotoToGallery() {
    this.photoService.addNewToGallery();
  }
}
