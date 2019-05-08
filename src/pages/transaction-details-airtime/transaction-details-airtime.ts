import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TransactionDetailsAirtimePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-transaction-details-airtime',
  templateUrl: 'transaction-details-airtime.html',
})
export class TransactionDetailsAirtimePage {
  refKey: number;
  token: number;
  transID: any;
  units: any;
  amountPaid: any;
  today: any;
  name: any;
  powerToken: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransactionDetailsAirtimePage');
  }

  ionViewWillEnter(){
    this.refKey = this.navParams.get('refKey');
    this.token = this.navParams.get('mainToken');
    this.powerToken = this.navParams.get('powerToken');
    this.transID = this.navParams.get('transID');
    this.units = this.navParams.get('units');
    this.amountPaid = this.navParams.get('amountPaid');
    this.name = this.navParams.get('name');

    this.today = new Date().toLocaleString().split('T');




  }

  home(){
    this.navCtrl.push('MenuPage');
  }

}
