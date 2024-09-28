import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuPage } from './menu.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { MenuPageRoutingModule } from './menu-routing.module';
import { HeaderModule } from '../header/header.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    MenuPageRoutingModule,
    HeaderModule
  ],
  declarations: [MenuPage]
})
export class MenuPageModule {}
