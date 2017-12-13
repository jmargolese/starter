import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymethodChoicesPage } from './paymethod-choices';

@NgModule({
  declarations: [
    PaymethodChoicesPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymethodChoicesPage),
  ],
})
export class PaymethodChoicesPageModule {}
