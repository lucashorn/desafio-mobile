import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FotosPage } from './fotos.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { FotosPageRoutingModule } from './fotos-routing.module';
import { HeaderModule } from '../header/header.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    FotosPageRoutingModule,
    HeaderModule
  ],
  declarations: [FotosPage]
})
export class FotosPageModule {}
