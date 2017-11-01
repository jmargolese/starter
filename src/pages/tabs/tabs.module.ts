import { TabsPage } from './tabs';
import { ComponentsModule } from './../../share-common-components/components.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';


@NgModule({
  declarations: [
    TabsPage,
  ],
  imports: [
    ComponentsModule,
    IonicPageModule.forChild(TabsPage),
  ],
})
export class TabsPageModule {}
