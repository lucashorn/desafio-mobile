import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { AuthChangeEvent, Session, SupabaseClient, createClient } from '@supabase/supabase-js'
import { environment } from 'src/environments/environment';

export interface User {
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
  // private supabaseAdmin: SupabaseClient
  private supabaseStorage = "https://slbespgvkdhwxlqgbuvo.supabase.co/storage/v1/object/public/ingredients"
  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) { 
    // cria o link com o cliente supabase
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)

    // cria um shortcut para o bucket
    this.galleryImagesBucket = this.supabase.storage.from('gallery-images') 
    // this.supabaseAdmin = createClient(environment.supabaseUrl, environment.serviceRoleKey)
  }

  // busca o usuário logado
  loggedUser() {
    return this.supabase.auth.getUser().then(({ data }) => data?.user)
  }

  // busca a sessão do usuário logado
  session() {
    return this.supabase.auth.getSession().then(({ data }) => data?.session)
  }

  // Fica observando alterações no estado de autenticação do usuário logado
  authChanges() {
    return this.supabase.auth.onAuthStateChange((event, session) => {
      console.log(event, session)
    })
  }

  // Cria o usuário
  signUp(email: string, password: string, apelido: string, profileImage?: string) {
    return this.supabase.auth.signUp(
      { 
        email, 
        password, 
        options: {
          data: {
            profileImage,
            apelido
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

  // async updateProfile(profile: User) {
  //   const user = await this.loggedUser
  //   const update = {
  //     ...profile,
  //     id: user?.id,
  //     updated_at: new Date(),
  //   }

  //   return this.supabase.from('profiles').upsert(update)
  // }

  // downLoadImage(path: string) {
  //   return this.supabase.storage.from('avatars').download(path)
  // }

  // uploadAvatar(filePath: string, file: File) {
  //   return this.supabase.storage.from('avatars').upload(filePath, file)
  // }

  async createNotice(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 5000 })
    await toast.present()
  }

  createLoader() {
    return this.loadingCtrl.create()
  }

  //lista a pasta raiz do bucket
  listItensInBucket(){
    return this.galleryImagesBucket.list()
  }
  
  //lista todas as imagens dentro de uma pasta especifica
  listImagesInFolder(folder: string){
    return this.galleryImagesBucket.list(folder)
  }

  //Faz upload para o bucket passando o nome da imagem, a pasta e o objeto da imagem
  uploadImage(imageName: string, folder: string, file: string | File | Blob){
    return this.galleryImagesBucket.upload(`${folder}/${imageName}.png`, file)
  }

  //busca uma imagem especifica
  downloadImage(imageName: string, folder: string){
    return this.galleryImagesBucket.download(`${folder}/${imageName}.png`)
  }
}
