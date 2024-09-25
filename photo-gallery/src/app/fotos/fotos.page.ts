import { Component, OnInit } from '@angular/core';
import { PhotoService, UserPhoto } from '../services/photo.service';

@Component({
  selector: 'app-fotos',
  templateUrl: 'fotos.page.html',
  styleUrls: ['fotos.page.scss']
})
export class FotosPage implements OnInit {

  constructor(public photoService: PhotoService) {}

  async ngOnInit() {
    await this.photoService.loadSaved();
  }

  public showActionSheet(photo: UserPhoto, position: number) {
    this.photoService.showActionSheet(photo, position);
  }

}
