import { ActionButtonComponent } from './../../share-common/components/action-button/action-button';
import { ComponentsModule } from './../../share-common/components/components.module';
//import { ComponentsModule } from '@common-shared/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrgHomePage } from './org-home';


@NgModule({
  declarations: [
    OrgHomePage,
  ],
  imports: [
    ComponentsModule,
    ActionButtonComponent,
    IonicPageModule.forChild(OrgHomePage),
  ],
})
export class OrgHomePageModule {}
