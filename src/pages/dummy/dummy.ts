import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AllServicesProvider } from '../../providers/all-services/all-services';

/**
 * Generated class for the DummyPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-dummy',
  templateUrl: 'dummy.html',
})
export class DummyPage {
  products$: any = {};


  constructor(public navCtrl: NavController, public navParams: NavParams, public allServices: AllServicesProvider) {
  }

  ionViewWillEnter() {
    console.log('ionViewDidLoad DummyPage');
    this.allServices.dummyReturn().subscribe(data=>{
     console.log(data);
      
     this.products$ = data;
     console.log(this.products$.name);
      
    });
  }

}
