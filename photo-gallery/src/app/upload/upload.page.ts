import { Component } from '@angular/core';
import { PhotoService } from '../services/photo.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-upload',
  templateUrl: 'upload.page.html',
  styleUrls: ['upload.page.scss']
})
export class UploadPage {

  constructor(
    public photoService: PhotoService,
    private userService: UserService
  ) {}

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
