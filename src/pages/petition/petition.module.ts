import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PetitionPage } from './petition';

@NgModule({
  declarations: [
    PetitionPage,
  ],
  imports: [
    IonicPageModule.forChild(PetitionPage),
  ],
})
export class PetitionPageModule {}
