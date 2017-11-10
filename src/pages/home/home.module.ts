import { ComponentsModule } from './../../share-common/components/components.module';


import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';




@NgModule({
  declarations: [
    HomePage
  ],
  entryComponents: [
    
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(HomePage),
  ],
})
export class HomePageModule {}
