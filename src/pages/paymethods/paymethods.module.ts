import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymethodsPage } from './paymethods';

@NgModule({
  declarations: [
    PaymethodsPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymethodsPage),
  ],
})
export class PaymethodsPageModule {}
