import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

// Interface para os metadados das fotos
export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public photos: UserPhoto[] = []; // Array para armazenar fotos capturadas

  constructor() {}

  // Método para capturar uma nova foto com a câmera
  public async addNewToGallery() {
    try {
      // Captura a foto
      const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 100
      });

      // Adiciona a nova foto ao início do array de fotos
      this.photos.unshift({
        filepath: capturedPhoto.webPath ?? '', // Usa uma string vazia se webPath for undefined
        webviewPath: capturedPhoto.webPath // Caminho para exibição na web
      });

      console.log('Foto capturada e adicionada com sucesso:', this.photos[0]);
    } catch (error) {
      console.error('Erro ao capturar a foto:', error);
    }
  }
}
