import { Component } from '@angular/core';
import { NavController, ToastController, IonicPage } from 'ionic-angular';
import { AllServicesProvider } from '../../providers/all-services/all-services';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  id: number;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public allServices: AllServicesProvider) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
    this.allServices.gLocatorId().then(data=>{
      
      let d:any = data;
      localStorage.setItem("locator", d);
      console.log(localStorage.getItem("locator"));
    }).catch(error=>{
      console.log(error);
    });
  }

  power(){
   this.navCtrl.push('PowerPage');
  }

  airtime(){
    this.navCtrl.push('AirtimePage');
  }

  data(){
   this.navCtrl.push('DataPage')
  }

  tv(){
    this.navCtrl.push('TvPage');

  }



}
