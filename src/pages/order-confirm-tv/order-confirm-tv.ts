import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { AllServicesProvider } from '../../providers/all-services/all-services';
import { RaveOptions } from 'angular-rave';


@IonicPage()
@Component({
  selector: 'page-order-confirm-tv',
  templateUrl: 'order-confirm-tv.html',
})
export class OrderConfirmTvPage {
  email: string;
  total: number;
  paymentMethod: any;
  convenienceFee: number = 100;
  phone: string;
  smartCard: number;
  tvMethod: any;
  sState: any;
  sDistrict: any;
  dataText: any;
  packageBundle: any;
  amount: any;
  refKey: string;
  token: any;
  amountToPay: number;
  transactionID: any;
  customerName: any;

  tNo: any;

  txref: any;
  msg: any;


  paymentOptions: RaveOptions = {
    PBFPubKey: 'FLWPUBK-fdd28b56a5a4b71905c27ff9dfb41245-X',
    customer_email: this.email,
    customer_phone: this.phone,

    amount: this.total * 100,
    currency: "NGN",

    txref: this.refKey
  }


  constructor(public navCtrl: NavController,
    public navParams: NavParams, public loadCtrl: LoadingController,
    public alertCtrl: AlertController,
    public allServices: AllServicesProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderConfirmTvPage');
  }


  ionViewWillEnter() {
    this.smartCard = this.navParams.get('smartCard');
    this.email = this.navParams.get('email');
    this.phone = this.navParams.get('phone');
    this.sState = this.navParams.get('sState ');
    this.sDistrict = this.navParams.get('sDistrict');
    this.dataText = this.navParams.get('dataText');
    this.packageBundle = this.navParams.get('packageBundle');
    this.amount = this.navParams.get('amount');
    this.smartCard = this.navParams.get('smartCard');
    this.token = this.navParams.get('token');

    this.refKey = this.randomInt();
    this.transactionID = this.navParams.get('transactionID');

    console.log(localStorage.getItem("locator"));

    this.amountToPay = this.navParams.get('amountToPay');
    this.customerName = this.navParams.get('customerName');

    this.total = this.amount;


    this.paymentOptions.customer_phone = this.phone;
    this.paymentOptions.customer_email = this.email;
    this.paymentOptions.amount = this.total;
    this.paymentOptions.custom_description = "Payment for Tv purchase";
    this.paymentOptions.txref = this.refKey;

  }



  randomInt() {
    return Math.random().toString().slice(2, 12);
  }

  back() {
    this.navCtrl.pop();
  }


  paymentInit() {
    console.log('Payment has started...');
  }



  paymentSuccess(event) {
    //a call to the getTvcard info
    this.allServices.tvReturn(
      localStorage.getItem("locator"),
      this.refKey,
      this.amountToPay,
      this.token
    ).then(data => {
      console.log(data);
      this.tNo = data['tNo'];
      this.msg = data['msg'];
      console.log(data['tNo']);
      console.log(data['msg']);

      console.log(event);
      if (event['respcode'] == "00") {
        this.loadCtrl.create({
          content: 'Your token is being generated',
          duration: 7000,
        }).present();

        this.navCtrl.push('TransactionDetailsTvPage',
          {
            reference: event.reference,
            status: event['data']['success'],
            total: this.total,
            refKey: this.refKey,
            token: this.token,
            amountToPay: this.amountToPay,
            transactionID: this.transactionID,
            customerName: this.customerName

          });

      }
    }).catch(error => {
      console.log(error);
    })
  }

  paymentFailure() {
    this.alertCtrl.create({
      title: 'Payment Cancelled!',
      message: 'Your order is not complete until you have confirmed payment.',
      buttons: [{
        text: 'OK',
        handler: () => {
          this.navCtrl.push('MenuPage');
        }
      }]

    }).present();
  }



}
