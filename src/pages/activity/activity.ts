import { MapOptions } from './../../share-common/components/share-map/share-map';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';

import * as shareTypes from '../../share-common/interfaces/interfaces';


@IonicPage()
@Component({
  selector: 'page-activity',
  templateUrl: 'activity.html',
})
export class ActivityPage { 
  public activity: shareTypes.Activity;
  public title: string = "";
  public mapOptions: MapOptions;

  constructor(public navCtrl: NavController, public navParams: NavParams, private launchNavigator: LaunchNavigator) {

    this.activity = navParams.get('activity') || {};
    if (this.activity) {
      this.title = this.activity.info.type || "Activity";
    }
    this.setupActivity();

  }

  public setupActivity(): void {
    switch (this.activity.info.type) {
      case 'map':
        this.mapOptions = this.activity.activityData.mapOptions;
        
        break;
    
      default:
        break;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ActivityPage');
  }

  public directions():void {
    let options: LaunchNavigatorOptions = { 
      //start: 'London, ON',  
      //app: LaunchNavigatorO.APPS.UBER
    };
    
    this.launchNavigator.navigate(this.mapOptions.center.address[0], options)
      .then(
        success => console.log('Launched navigator'),
        error => console.log('Error launching navigator', error)
      );
  }
}
