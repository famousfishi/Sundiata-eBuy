import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AllServicesProvider } from '../../providers/all-services/all-services';
import { RaveOptions } from 'angular-rave';



@IonicPage()
@Component({
  selector: 'page-order-confirm-data',
  templateUrl: 'order-confirm-data.html',
})
export class OrderConfirmDataPage {
  email: string;
  phone: string;
  total: number;



  sState: any;
  sDistrict: any;
  amount: number;

  dataText: any;
  dataBundle: any;
  refKey: any;

  amount_paid: number = 0;
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
    public navParams: NavParams, public alertCtrl: AlertController,
    public loadCtrl: LoadingController, public allServices: AllServicesProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderConfirmDataPage');
  }

  ionViewWillEnter() {
    console.log(this.sState = this.navParams.get('sState'));
    console.log(this.sDistrict = this.navParams.get('sDistrict'));
    console.log(this.email = this.navParams.get('email'));

    console.log(this.phone = this.navParams.get('phone'));

    console.log(this.dataText = this.navParams.get('dataText'));
    console.log(this.dataBundle = this.navParams.get('dataBundle'));
    console.log(this.amount = this.navParams.get('amount'));

    this.refKey = this.randomInt();



    this.total = this.amount;
    this.amount_paid = this.amount + 0;


    this.paymentOptions.customer_phone = this.phone;
    this.paymentOptions.customer_email = this.email;
    this.paymentOptions.amount = this.total;
    this.paymentOptions.custom_description = "Payment for data purchase";
    this.paymentOptions.txref = this.refKey;

  }


  randomInt() {
    return Math.random().toString().slice(2, 12);
  }

  back() {
    this.navCtrl.pop();
  }

  paymentInit() {
    console.log('Payment has started ...');
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

  paymentSuccess(event) {
    // a call to the data return API
    this.allServices.dataReturn(

      this.sState,
      this.sDistrict,
      this.email,
      this.phone,
      this.amount,
      this.amount_paid,
      this.refKey,
      localStorage.getItem("locator")
    ).then(data => {
      console.log(data);
      this.tNo = data['tNo'];
      this.msg = data['msg'];
      console.log(data['tNo']);
      console.log(data['msg']);


      console.log(event);
      if (event['respcode'] == "00") {
        this.loadCtrl.create({
          content: 'Please wait while we process your transaction',
          duration: 7000,
        }).present();

        this.navCtrl.push('TransactionDetailsDataPage',
          {
            reference: event.reference,
            status: event['data']['success'],
            total: this.total,
            tNo: this.tNo,
            refKey: this.refKey
          });

      }

    }).catch(error => {
      console.log(error);
    })




  }
}
