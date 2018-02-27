import { NativeStorage } from '@ionic-native/native-storage';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage {
  public buttonText: string = "Next";
  public showDoneButton: boolean = false;

  @ViewChild(Slides) slides: Slides;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad IntroPage');
  }

  next() {
    if (this.slides.isEnd()) {
      this.viewCtrl.dismiss()
        .catch(() => { })
    } else {
      this.slides.slideNext();
    }

  }

  slideChanged() {
    if (this.slides.isEnd()) {
      this.buttonText = "Close";
      this.showDoneButton = true;
    } else {
      this.showDoneButton = false;
    }


  }

}
