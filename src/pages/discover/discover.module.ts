import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DiscoverPage } from './discover';

import { ComponentsModule } from '../../share-common/components/components.module';
 
 //import { SharedComponentsModule } from '../../../../common/src/components/shared-components.module'

@NgModule({
  declarations: [
    DiscoverPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(DiscoverPage),
  ],
})
export class DiscoverPageModule {}
