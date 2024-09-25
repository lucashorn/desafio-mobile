import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard';
import { LoginPage } from './login/login.page'; // Ajuste o caminho se necessário
import { MenuPage } from './menu/menu.page'; // Ajuste o caminho se necessário
import { UploadPage } from './upload/upload.page';
import { FotosPage } from './fotos/fotos.page';


const routes: Routes = [
  {
    path: '',
    component: MenuPage,
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginPage,
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./signup/signup.module').then( m => m.SignupPageModule)
  },
  {
    path: 'menu',
    component: MenuPage,
    loadChildren: () => import('./menu/menu.module').then(m => m.MenuPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'upload',
    component: UploadPage,
    loadChildren: () => import('./upload/upload.module').then(m => m.UploadPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'fotos',
    component: FotosPage,
    loadChildren: () => import('./fotos/fotos.module').then(m => m.FotosPageModule),
    canActivate: [AuthGuard]
  },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
