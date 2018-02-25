import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommunicatePage } from './communicate';

@NgModule({
  declarations: [
    CommunicatePage,
  ],
  imports: [
    IonicPageModule.forChild(CommunicatePage),
  ],
})
export class CommunicatePageModule {}
