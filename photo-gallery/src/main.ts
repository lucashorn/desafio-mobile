import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

// Importe o loader dos elementos PWA do Ionic
import { defineCustomElements } from '@ionic/pwa-elements/loader';

// Chame o carregador dos elementos personalizados antes de inicializar o módulo principal
defineCustomElements(window);

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));