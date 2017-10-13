import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';

import { HomeListOrganizationComponent } from './home-list-organization/home-list-organization';
import { OrgHomeItemComponent } from './org-home-item/org-home-item';

@NgModule({
	declarations: [HomeListOrganizationComponent,
    OrgHomeItemComponent],
	imports: [IonicModule.forRoot(HomeListOrganizationComponent)],
	exports: [HomeListOrganizationComponent,
    OrgHomeItemComponent]
})
export class ComponentsModule {}
