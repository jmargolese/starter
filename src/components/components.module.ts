import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';

import { HomeListOrganizationComponent } from './home-list-organization/home-list-organization';
import { OrgHomeItemComponent } from './org-home-item/org-home-item';
import { ActionsBarComponent } from './actions-bar/actions-bar';
import { ActionButtonComponent } from './action-button/action-button';
import { OrgHomeComponent } from './org-home/org-home';

@NgModule({
	declarations: [HomeListOrganizationComponent,
    OrgHomeItemComponent,
    ActionsBarComponent,
    ActionButtonComponent,
    OrgHomeComponent],
	imports: [IonicModule.forRoot(HomeListOrganizationComponent)],
	exports: [HomeListOrganizationComponent,
    OrgHomeItemComponent,
    ActionsBarComponent,
    ActionButtonComponent,
    OrgHomeComponent]
})
export class ComponentsModule {}
