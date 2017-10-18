import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsPasscodePage } from './settings-passcode';

@NgModule({
  declarations: [
    SettingsPasscodePage,
  ],
  imports: [
    IonicPageModule.forChild(SettingsPasscodePage),
  ],
})
export class SettingsPasscodePageModule {}
