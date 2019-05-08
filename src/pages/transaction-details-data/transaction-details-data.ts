import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the TransactionDetailsDataPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-transaction-details-data',
  templateUrl: 'transaction-details-data.html',
})
export class TransactionDetailsDataPage {
  tNo: any;
  today: any;
  refKey: number;
  status: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransactionDetailsDataPage');
  }

  ionViewWillEnter() {
    this.tNo = this.navParams.get('tNo');
    this.refKey = this.navParams.get('refKey');

    this.today = new Date().toLocaleString().split('T');
    this.status = this.navParams.get('status');
  }

  home() {
    this.navCtrl.push('MenuPage')
  }



}
