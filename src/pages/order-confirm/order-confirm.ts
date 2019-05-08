import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { AllServicesProvider } from '../../providers/all-services/all-services';
import { RaveOptions } from 'angular-rave';



@IonicPage()
@Component({
  selector: 'page-order-confirm',
  templateUrl: 'order-confirm.html',
})
export class OrderConfirmPage {
  email: string;
  phone: string;
  meterNo: number;
  paymentMethod: string;
  stateMethod: string;
  amount: number;
  convenienceFee: number;
  total: number;


  networkMethod: string;
  buttonsPage: any[];
  meterTypeMethod: string;
  refKey: any;

  pickedStateMethod: string;
  discoMethod: number;


  token: number;
  transID: any;
  amountPaid: number;
  units: any;
  status: any;
  dataText: any;
  meterText: any;
  userDisco: number;
  name: any;
  providerElectricity: any;
  serviceProvider: any;

  powerToken: number;
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






  constructor(public navCtrl: NavController, public navParams: NavParams,
    public loadCtrl: LoadingController, public alertCtrl: AlertController,
    public allServices: AllServicesProvider) {




  }

  ionViewWillEnter() {
    console.log('printing for power....')
    this.email = this.navParams.get('email');
    this.amount = parseInt(this.navParams.get('amount'));
    this.stateMethod = this.navParams.get('stateMethod');
    this.paymentMethod = this.navParams.get('paymentMethod');
    this.meterNo = this.navParams.get('meterNo');
    this.phone = this.navParams.get('phone');
    this.convenienceFee = this.navParams.get('convenienceFee');
    this.meterTypeMethod = this.navParams.get('meterTypeMethod');
    this.pickedStateMethod = this.navParams.get('pickedStateMethod');
    this.discoMethod = this.navParams.get('discoMethod');
    this.amountPaid = this.navParams.get('amountPaid') ? this.navParams.get('amountPaid') : "No amount paid in parameter list";
    this.dataText = this.navParams.get('dataText');
    this.meterText = this.navParams.get('meterText');
    this.userDisco = this.navParams.get('userDisco');
    this.providerElectricity = this.navParams.get('providerElectricity');
    this.name = this.navParams.get('name');
    this.serviceProvider = this.navParams.get('serviceProvider');

    this.refKey = this.randomInt();

    this.token = this.navParams.get('token');
    console.log('refKey is : ' + this.refKey);
    this.total = this.amountPaid;
    console.log('the amount paid to be sent ' + this.total);


    this.paymentOptions.customer_phone = this.phone;
    this.paymentOptions.customer_email = this.email;
    this.paymentOptions.amount = this.total;
    this.paymentOptions.custom_description = "Payment for power purchase";
    this.paymentOptions.txref = this.refKey;



  }





  randomInt() {
    return Math.random().toString().slice(2, 12);
  }



  back() {
    this.navCtrl.pop();
  }

  paymentInit() {
    console.log('Payment has kicked started..');
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

  paymentSuccess(event: { trans: any; reference: any; status: any; }) {
    this.allServices.powerReturn(
      localStorage.getItem("locator"),
      this.refKey,
      this.amountPaid,
      this.token
    ).then(data => {
      console.log(data);
      this.tNo = data['tNo'];
      this.msg = data['msg'];
      console.log(data['tNo']);
      console.log(data['msg']);

      this.token = data['msg']['token'];
      this.powerToken = data['msg']['token'];
      console.log(data['msg']['token']);
      this.transID = data['msg']['transID'];
      console.log(data['msg']['transID']);
      this.amountPaid = data['msg']['amountPaid'];
      console.log(data['msg']['amountPaid']);
      this.units = data['msg']['units'];
      console.log(data['msg']['units']);
      this.status = data['status'];
      console.log(data['status']);

      console.log(this.amountPaid = this.navParams.get('amountPaid'));

      console.log(this.token = this.navParams.get('token'));

      //if anything goes wrong
      if (data['status'] == '-2000') {
        this.alertCtrl.create({
          title: 'Sundiata Message',
          message: 'Something must have gone wrong while trying to dispense your token units',
          buttons: ['OK']
        }).present();
      }

      console.log(event);
      if (event['respcode'] == "00") {
        this.loadCtrl.create({
          content: 'Your power token is being generated',
          duration: 7000,
        }).present();

        this.navCtrl.push('TransactionDetailsAirtimePage',
          {
            meterNo: this.meterNo,
            reference: event.reference,
            refKey: this.refKey,
            status: event['data']['success'],
            total: this.total,
            token: this.token,
            transID: this.transID,
            units: this.units,
            amountPaid: this.amountPaid,
            name: this.name,
            powerToken: this.powerToken


          });

      }

      //ENDS HERE
    }).catch(error => {
      console.log(error);
    }
    );
  }








}
