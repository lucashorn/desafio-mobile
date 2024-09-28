import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UploadPage } from './upload.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { UploadPageRoutingModule } from './upload-routing.module';
import { HeaderModule } from '../header/header.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    UploadPageRoutingModule,
    HeaderModule
  ],
  declarations: [UploadPage]
})
export class UploadPageModule {}
