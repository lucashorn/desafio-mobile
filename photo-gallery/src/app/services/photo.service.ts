import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core'; // Adicione esta importação

// Interface para os metadados das fotos
export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public photos: UserPhoto[] = [];
  private PHOTO_STORAGE: string = 'photos';
  private platform: Platform;

  constructor(platform: Platform) {
    this.platform = platform;
  }

  // Método para capturar uma nova foto com a câmera
  public async addNewToGallery() {
    try {
      // Captura a foto
      const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 100
      });

      // Salva a foto e adiciona ao array de fotos
      const savedImageFile = await this.savePicture(capturedPhoto);
      this.photos.unshift(savedImageFile);

      // Salva o array de fotos nas preferências
      await Preferences.set({
        key: this.PHOTO_STORAGE,
        value: JSON.stringify(this.photos),
      });

      console.log('Foto capturada e adicionada com sucesso:', savedImageFile);
    } catch (error) {
      console.error('Erro ao capturar a foto:', error);
    }
  }

  private async savePicture(photo: Photo) {
    // Converte a foto para o formato base64
    const base64Data = await this.readAsBase64(photo);

    // Escreve o arquivo no diretório de dados
    const fileName = Date.now() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });

    if (this.platform.is('hybrid')) {
      // Exibe a nova imagem convertendo o caminho 'file://' para HTTP
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
    } else {
      // Usa o webPath para exibir a nova imagem em vez de base64
      return {
        filepath: fileName,
        webviewPath: photo.webPath
      };
    }
  }

  private async readAsBase64(photo: Photo) {
    if (this.platform.is('hybrid')) {
      // Lê o arquivo no formato base64 para plataformas móveis
      const file = await Filesystem.readFile({
        path: photo.path!
      });
      return file.data;
    } else {
      // Web: busca a foto, lê como um blob e converte para formato base64
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();
      return await this.convertBlobToBase64(blob) as string;
    }
  }

  private convertBlobToBase64 = (blob: Blob) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(blob);
  });

  public async loadSaved() {
    // Recupera os dados da foto salvos nas preferências
    const { value } = await Preferences.get({ key: this.PHOTO_STORAGE });
    this.photos = (value ? JSON.parse(value) : []) as UserPhoto[];

    if (!this.platform.is('hybrid')) {
      // Plataforma web: lê a foto do sistema de arquivos em formato base64
      for (let photo of this.photos) {
        const readFile = await Filesystem.readFile({
          path: photo.filepath,
          directory: Directory.Data
        });
        photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
      }
    }
  }
}
