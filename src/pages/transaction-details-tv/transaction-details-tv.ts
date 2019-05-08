import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TransactionDetailsTvPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-transaction-details-tv',
  templateUrl: 'transaction-details-tv.html',
})
export class TransactionDetailsTvPage {
  token: any;
  refKey: any;
  today: any;
  transactionID: any;
  customerName: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransactionDetailsTvPage');
  }

  ionViewWillEnter() {
    this.refKey = this.navParams.get('refKey');
    this.token = this.navParams.get('token');
    this.transactionID = this.navParams.get('transactionID');
    this.customerName = this.navParams.get('customerName');


    this.today = new Date().toLocaleString().split('T');
  }


  home() {
    this.navCtrl.push('MenuPage')
  }


}
