import { Component, OnInit } from '@angular/core';
import { PhotoService, UserPhoto } from '../services/photo.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-fotos',
  templateUrl: 'fotos.page.html',
  styleUrls: ['fotos.page.scss']
})
export class FotosPage implements OnInit {
  public likes: { [key: number]: number } = {};
  public showComments: { [key: number]: boolean } = {};
  public newComment: { [key: number]: string } = {};

  constructor(
    public photoService: PhotoService,
    private authService: AuthService,
    private supabase: SupabaseService
  ) {
    this.photoService.photos.forEach((photo, index) => {
      // this.likes[index] = 0;
      this.showComments[index] = false;
      this.newComment[index] = '';
    });
  }

  async ngOnInit() {
    await this.photoService.loadSaved();
  }

  public showActionSheet(photo: UserPhoto, position: number) {
    this.photoService.showActionSheet(photo, position);
  }

  public async toggleLike(photoId: string, liked: boolean) {
    await this.supabase.toggleLikeOnPhoto(liked, photoId)
    await this.photoService.loadSaved()
  }

  public toggleComments(position: number) {
    this.showComments[position] = !this.showComments[position];
  }

  public async addComment(photoId: string, position: number) {
    if (this.newComment[position]) {
      await this.supabase.insertComment(this.newComment[position], photoId)
      await this.photoService.loadSaved()

      this.newComment[position] = '';
    }
  }

  logout() {
    this.authService.logout();
  }
}
