import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BrowsePage } from './browse';

import { ComponentsModule } from '../../components/components.module';
 
 import { SharedComponentsModule } from '../../../../common/src/components/shared-components.module'

@NgModule({
  declarations: [
    BrowsePage,
  ],
  imports: [
    ComponentsModule,
    SharedComponentsModule,
    IonicPageModule.forChild(BrowsePage),
  ],
})
export class BrowsePageModule {}
