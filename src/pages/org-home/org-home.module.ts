import { ComponentsModule } from './../../components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrgHomePage } from './org-home';

@NgModule({
  declarations: [
    OrgHomePage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(OrgHomePage),
  ],
})
export class OrgHomePageModule {}
