import { MapOptions } from './../../share-common/components/share-map/share-map';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import * as shareTypes from '../../share-common/interfaces/interfaces';

import { ENV } from '@app/env';

@IonicPage()
@Component({
  selector: 'page-activity',
  templateUrl: 'activity.html',
})
export class ActivityPage { 
  public options : shareTypes.ActivityOptions;
  public activity: shareTypes.Activity;
  public title: string = "";
  public mapOptions: MapOptions;

  constructor(public navCtrl: NavController, public navParams: NavParams) {

    this.activity = navParams.get('activity') || {};
    if (this.activity) {
      this.title = this.activity.info.type || "Activity";
    }
    this.setupActivity();

  }

  public setupActivity(): void {
    switch (this.activity.info.type) {
      case 'map':
        this.mapOptions = this.activity.activityData;
        
        break;
    
      default:
        break;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ActivityPage');
  }

}
