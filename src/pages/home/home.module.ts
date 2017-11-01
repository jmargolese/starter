import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';

import { ComponentsModule } from '../../share-common-components/components.module';

@NgModule({
  declarations: [
    HomePage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(HomePage),
  ],
})
export class HomePageModule {}
