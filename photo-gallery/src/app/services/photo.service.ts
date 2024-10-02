import { Injectable, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { ActionSheetController, Platform } from '@ionic/angular';
import { SupabaseService } from './supabase.service';
import { UserService } from './user.service';

export interface UserPhoto {
  id?: string,
  filepath: string;
  dataUrl?: string;
  format: string;
  timestamp?: number;
  likes?: number;
  liked?: boolean;
  comments?: any[];
}
@Injectable({
  providedIn: 'root'
})
export class PhotoService{
  public photos: UserPhoto[] = [];
  public temporaryPhotos: UserPhoto[] = [];

  user: any;

  constructor(private actionSheetController: ActionSheetController, private supabase: SupabaseService, private userService: UserService) {
    this.user = this.userService.getUser();
  }

  public async showActionSheet(photo: UserPhoto, position: number) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Fotos',
      buttons: [
      {
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.deletePicture(photo, position);
        }
      },
      // {
      //   text: 'Download',
      //   role: 'destructive',
      //   icon: 'download',
      //   handler: () => {
          
      //   }
      // },
      {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
        }
      }]
    });
    await actionSheet.present();
  }

  public async captureProfilePhoto() : Promise<Photo> {
    try {
      const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        quality: 100
      });
      return capturedPhoto
    } catch (error) {
      console.error('Erro ao capturar a foto:', error);
      throw error;
    }
  }

  public async capturePhoto(saveTemporary = true): Promise<UserPhoto> {
    try {
      const capturedPhoto = await Camera.getPhoto({
        resultType: CameraResultType.DataUrl,
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
    this.temporaryPhotos.forEach(async (photo) => {
      const folder = 'UploadedPhotos'
      await this.supabase.uploadImageStorage(photo, folder).then(() => this.loadSaved())
    })

    // Limpa a lista de fotos temporárias
    this.temporaryPhotos = [];
  }

  public async discardAllPhotos() {
    // Limpa a lista de fotos temporárias sem salvar
    this.temporaryPhotos = [];
  }

  private async savePicture(photo: Photo): Promise<UserPhoto> {
    const fileName = Date.now().toString();

    return {
      filepath: fileName,
      dataUrl: photo.dataUrl,
      format: photo.format,
    };
  }

  public async loadSaved() {
    const loadedPhotos: UserPhoto[] = [];
    const { data } = await this.supabase.listImagesInFolder('UploadedPhotos')

    for(const image of data!){
      if(image.name != ".emptyFolderPlaceholder"){
        const imageBlob = await this.supabase.downLoadImage(`UploadedPhotos/${image.name}`)
        const imageUrl = URL.createObjectURL(imageBlob.data!)
        const imageComments = await this.supabase.getCommentsByImageId(image.id)
        const imageLikes = (await this.supabase.getLikesByImageId(image.id)).data!
        const isLiked = imageLikes.some(like => like.usuario_id == this.user.id)
        const photo: UserPhoto = {
          id: image.id,
          filepath: image.name,
          dataUrl: imageUrl,
          format: image.metadata['mimetype'],
          comments: imageComments ? imageComments : [],
          likes: imageLikes.length,
          liked: isLiked
        }
        loadedPhotos.push(photo)
      }
    }
    this.photos = [...loadedPhotos]

    this.photos.sort((a, b) => (b.timestamp ?? 0) - (a.timestamp ?? 0));

  }

  public async deletePicture(photo: UserPhoto, position: number) {
    this.photos.splice(position, 1);

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
}
