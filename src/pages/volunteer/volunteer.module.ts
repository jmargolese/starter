import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VolunteerPage } from './volunteer';
import { ComponentsModule } from './../../share-common/components/components.module';

@NgModule({
  declarations: [
    VolunteerPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(VolunteerPage),
  ],
})
export class VolunteerPageModule {}
