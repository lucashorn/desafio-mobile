import { Component, OnInit } from '@angular/core';
import { PhotoService } from '../services/photo.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-upload',
  templateUrl: 'upload.page.html',
  styleUrls: ['upload.page.scss']
})
export class UploadPage implements OnInit {

  user: any;
  savedImage: any;

  constructor(
    public photoService: PhotoService,
    private userService: UserService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userService.getUser().subscribe(user => {      
      this.user = user;
      this.updateProfileImage();
    });
  }

  private updateProfileImage() {
    this.savedImage = this.user?.profileImage || 'assets/icon/user.png';
  }

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

  logout() {
    this.authService.logout();
  }
}
