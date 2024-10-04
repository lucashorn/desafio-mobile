import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthChangeEvent, Session, SupabaseClient, createClient } from '@supabase/supabase-js'
import { environment } from 'src/environments/environment';
import { UserPhoto } from './photo.service';
import { Photo } from '@capacitor/camera';

export interface UserRegister {
  username: string
  password: string
  apelido: string
  profileImage?: string
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient
  private galleryImagesBucket;
  constructor() { 
    // cria o link com o cliente supabase
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)

    // cria um shortcut para o bucket
    this.galleryImagesBucket = this.supabase.storage.from('gallery-images')
  }

  // busca o usuário logado
  getUser() {
    return this.supabase.auth.getUser().then(({ data }) => data?.user)
  }

  // Fica observando alterações no estado de autenticação do usuário logado
  authChanges() {
    return this.supabase.auth.onAuthStateChange((event, session) => {})
  }

  // Cria o usuário
  signUp(email: string, password: string, apelido: string, profileImage?: string) {
    return this.supabase.auth.signUp(
      {
        email, 
        password, 
        options: {
          data: {
            apelido,
            profileImage
          }
        } 
      })
  }

  // Faz login
  signIn(email: string, password: string) {
    return this.supabase.auth.signInWithPassword({ email, password})
  }

  // Faz logout
  signOut() {
    return this.supabase.auth.signOut()
  }

  downLoadImage(path: string) {
    return this.galleryImagesBucket.download(path)
  }

  //lista a pasta raiz do bucket
  listItensInBucket(){
    return this.galleryImagesBucket.list()
  }
  
  //lista todas as imagens dentro de uma pasta especifica
  listImagesInFolder(folder: string){
    return this.galleryImagesBucket.list(folder)
  }

  async uploadProfileImageStorage(photo: Photo, filename: string){
    const file = await fetch(photo.dataUrl!)
    .then((res)=> res.blob())
    .then((blob) => new File([blob], filename, {type: `image/${photo.format}`}))

    return this.galleryImagesBucket.upload(`ProfileImages/${filename}`, file, {contentType: file.type})
  }

  //Faz upload para o bucket passando o nome da imagem, a pasta e o objeto da imagem
  async uploadImageStorage(photo: UserPhoto, folder: string){
    const file = await fetch(photo.dataUrl!)
    .then((res)=> res.blob())
    .then((blob) => new File([blob], photo.filepath, {type: `image/${photo.format}`}))

    return this.galleryImagesBucket.upload(`${folder}/${photo.filepath}.${photo.format}`, file, {contentType: file.type})
  }

  //busca uma imagem especifica
  downloadImage(imageName: string, folder: string){
    return this.galleryImagesBucket.download(`${folder}/${imageName}`)
  }

  emptyBucket(){
    return this.supabase.storage.emptyBucket('gallery-images')
  }

  async insertComment(content: string, imageId: string){
    const userId = await this.getUser().then(user => user?.id)
    if(!userId){
      return
    }
    await this.supabase.from('comentarios').insert({conteudo: content, imagem_id: imageId, usuario_id: userId})
  }

  async getCommentsByImageId(imageId: string){
    return (await this.supabase.from('comentarios').select().eq('imagem_id', imageId)).data!
  }

  async toggleLikeOnPhoto(liked: boolean, imageId: string){
    const userId = await this.getUser().then(user => user?.id)
    if(!userId){
      return
    }
    if(!liked){
      await this.supabase.from('curtidas').insert({imagem_id: imageId, usuario_id: userId})
    }
    else{
      await this.supabase.from('curtidas').delete().eq('usuario_id', userId).eq('imagem_id', imageId)
    }
  }
  
  async getLikesByImageId(imageId: string) {
    return (await this.supabase.from('curtidas').select().eq('imagem_id', imageId))
  }
}
