import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FotosPage } from './fotos.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { FotosPageRoutingModule } from './fotos-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    FotosPageRoutingModule
  ],
  declarations: [FotosPage]
})
export class FotosPageModule {}
