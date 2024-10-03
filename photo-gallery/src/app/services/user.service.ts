import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user: any;

  constructor(private supabase: SupabaseService) {
    this.user = this.getUserFromStorage();
  }

  getUser() {
    this.user = this.getUserFromStorage();

    return this.user;
  }

  private getUserFromStorage() {
    const user = JSON.parse(localStorage.getItem('sb-slbespgvkdhwxlqgbuvo-auth-token') || '{}').user;
    if(user && user.user_metadata){
      const userMetadata = user.user_metadata;
      if(userMetadata.profileImage){
        const profileImage = userMetadata.profileImage
        this.supabase.downLoadImage(`ProfileImages/${profileImage}`).then(image => {
          this.user.profileImage = URL.createObjectURL(image.data!)
        })
      }
      return {
        id: userMetadata.sub, 
        apelido: userMetadata.apelido,
        email: userMetadata.email
      };
    }
    return;
  }
}
