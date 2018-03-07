import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActivityPage } from './activity';
import { ComponentsModule } from '../../share-common/components/components.module';

@NgModule({
  declarations: [
    ActivityPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(ActivityPage),
  ],
})
export class ActivityPageModule {}
