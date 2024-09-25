import { Component, OnInit } from '@angular/core';
import { PhotoService, UserPhoto } from '../services/photo.service';

@Component({
  selector: 'app-upload',
  templateUrl: 'upload.page.html',
  styleUrls: ['upload.page.scss']
})
export class UploadPage {

  constructor(public photoService: PhotoService) {}


  async addPhotoToGallery() {
    await this.photoService.capturePhoto();
  }

  async confirmPhotos() {
    await this.photoService.confirmAllPhotos();
  }

  async discardPhotos() {
    await this.photoService.discardAllPhotos();
  }
  
  get hasTemporaryPhotos() {
    return this.photoService.temporaryPhotos.length > 0;
  }
}
