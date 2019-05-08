import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AllServicesProvider } from '../../providers/all-services/all-services';

@IonicPage()
@Component({
  selector: 'page-transaction-details',
  templateUrl: 'transaction-details.html',
})
export class TransactionDetailsPage {
  reference: string ="";
  status: string ="";
  response: any = "";
  meterNo: number;

  paymentMethod: string;
  pReference: any;
  refBaba: number;
  refKey: number;
  id: number;
gLocatorID: number;
  tNo: any;
  msg: any;


today: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public allServices : AllServicesProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransactionDetailsPage');
  }


  ionViewWillEnter(){
    this.meterNo = this.navParams.get('meterNo');

   this.refKey = this.navParams.get('refKey');
  this.status = this.navParams.get('status');
  this.gLocatorID = this.navParams.get('gLocatorID');
   // this.response = this.navParams.get('response');
   this.tNo = this.navParams.get('tNo');
   this.msg = this.navParams.get('msg');


  this.today = new Date().toLocaleString().split('T');

  }

  home(){
    this.navCtrl.push('MenuPage')
  }



}
