import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MarchPage } from './march';
import { ComponentsModule } from './../../share-common/components/components.module';

@NgModule({
  declarations: [
    MarchPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(MarchPage),
  ],
})
export class MarchPageModule {}
