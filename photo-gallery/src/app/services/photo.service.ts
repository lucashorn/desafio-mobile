import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { ActionSheetController, Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
  timestamp?: number;
  likes?: number;
  liked?: boolean;
  comments?: string[];
}
@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  public photos: UserPhoto[] = [];
  private PHOTO_STORAGE: string = 'photos';
  private platform: Platform;
  public temporaryPhotos: UserPhoto[] = [];

  constructor(private actionSheetController: ActionSheetController, platform: Platform) {
    this.platform = platform;
  }

  public async showActionSheet(photo: UserPhoto, position: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Fotos',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.deletePicture(photo, position);
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
        }
      }]
    });
    await actionSheet.present();
  }

  public async capturePhoto(saveTemporary = true): Promise<UserPhoto> {
    try {
      const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        quality: 100
      });

      const savedImageFile = await this.savePicture(capturedPhoto);
      savedImageFile.timestamp = Date.now();
      savedImageFile.likes = 0;
      savedImageFile.comments = [];

      // Adiciona à lista temporária
      if (saveTemporary)
        this.temporaryPhotos.push(savedImageFile);

      return savedImageFile;
    } catch (error) {
      console.error('Erro ao capturar a foto:', error);
      throw error;
    }
  }

  public async confirmAllPhotos() {
    // Adiciona todas as fotos temporárias à galeria permanente
    this.photos.push(...this.temporaryPhotos);

    await Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos),
    });

    // Limpa a lista de fotos temporárias
    this.temporaryPhotos = [];

    this.photos.sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0));

  }

  public async discardAllPhotos() {
    // Limpa a lista de fotos temporárias sem salvar
    this.temporaryPhotos = [];
  }

  private async savePicture(photo: Photo): Promise<UserPhoto> {
    const base64Data = await this.readAsBase64(photo);
    const fileName = Date.now() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });

    if (this.platform.is('hybrid')) {
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
    } else {
      return {
        filepath: fileName,
        webviewPath: photo.webPath
      };
    }
  }

  public async readAsBase64(photo: Photo | UserPhoto): Promise<string> {
    let webPath: string | undefined;
  
    if ('webPath' in photo) {
      // Se for do tipo 'Photo'
      webPath = photo.webPath;
    } else if ('webviewPath' in photo) {
      // Se for do tipo 'UserPhoto'
      webPath = photo.webviewPath;
    }
  
    if (webPath) {
      const response = await fetch(webPath);
      const blob = await response.blob();
      return await this.convertBlobToBase64(blob);
    }
  
    return ''; // Retorna uma string vazia se não houver um webPath válido
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
    const { value } = await Preferences.get({ key: this.PHOTO_STORAGE });
    this.photos = (value ? JSON.parse(value) : []) as UserPhoto[];

    if (!this.platform.is('hybrid')) {
      for (let photo of this.photos) {
        const readFile = await Filesystem.readFile({
          path: photo.filepath,
          directory: Directory.Data
        });
        photo.webviewPath = `data:image/jpeg;base64,${readFile.data}`;
      }
    }

    this.photos.sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0));

  }

  public async getImage(filepath: string) {
    const readFile = await Filesystem.readFile({
      path: filepath,
      directory: Directory.Data
    });
    return `data:image/jpeg;base64,${readFile.data}`;
  }

  public async deletePicture(photo: UserPhoto, position: number) {
    this.photos.splice(position, 1);

    await Preferences.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos)
    });

    const filename = photo.filepath.substr(photo.filepath.lastIndexOf('/') + 1);

    try {
      await Filesystem.deleteFile({
        path: filename,
        directory: Directory.Data
      });
    } catch (error) {
      console.error('Erro ao excluir o arquivo', error);
    }
  }

  public async updatePhoto(photo: UserPhoto) {
    const index = this.photos.findIndex(p => p.filepath === photo.filepath);
    if (index > -1) {
      this.photos[index] = photo;
      await Preferences.set({
        key: this.PHOTO_STORAGE,
        value: JSON.stringify(this.photos)
      });
    }
  }
}
