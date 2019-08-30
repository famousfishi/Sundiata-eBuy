import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { AllServicesProvider } from '../../providers/all-services/all-services';
import { RaveOptions } from 'angular-rave';
import { NotificationProvider } from '../../providers/notification/notification';
import { InAppBrowser, InAppBrowserObject, InAppBrowserEvent } from '@ionic-native/in-app-browser/ngx';
import { Rave, RavePayment } from 'rave-ionic3';
import { retry } from 'rxjs/operators';
import { ServicesTvProvider } from '../../providers/services-tv/services-tv';

@IonicPage()
@Component({
  selector: 'page-order-confirm-tv',
  templateUrl: 'order-confirm-tv.html',
})
export class OrderConfirmTvPage {
  paymentObject: any;
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

  locator: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams, public loadCtrl: LoadingController,
    public alertCtrl: AlertController,
    public allServices: AllServicesProvider,
    private notification: NotificationProvider,private rave: Rave,
    private ravePayment: RavePayment,
    private iab: InAppBrowser,
    private tv: ServicesTvProvider) {
      this.locator = localStorage.getItem('locator');
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

  payWithCard() {
    this.rave.init(this.notification.PRODUCTION_FLAG, this.notification.FLUTTERWAVE_PUBLIC_KEY)
    .then(_ => {
      this.paymentObject = this.ravePayment.create({
        customer_email: this.email,
        amount: this.amount,
        customer_phone: this.phone,
        currency: 'NGN',
        txref: this.refKey,
        redirect_url: `${this.notification.SERVER_HOST}mobile-requests/tv/${this.locator}/${this.token}`,
      });
      this.rave.preRender(this.paymentObject)
      .then(secureLink => {
        secureLink = secureLink + ' ';
        const browser: InAppBrowserObject = this.rave.render(secureLink, this.iab);
        browser.on('loadstop')
        .subscribe((event: InAppBrowserEvent) => {
          if (event.url.indexOf(`${this.notification.SERVER_HOST}mobile-requests/tv/${this.locator}/${this.token}`) !== -1) {
            let paymentResponse = decodeURIComponent(event.url);
            paymentResponse = paymentResponse.slice(paymentResponse.indexOf('=') + 1, paymentResponse.length)
            paymentResponse = JSON.parse(paymentResponse);
            console.log('paymentResponse');
            console.log(paymentResponse);
            const status = paymentResponse['status'];
            if (status === 'failed') {
              this.notification.ShowAlert('Payment Failed!');
            } else {
              this.notification.ShowLoading('Payment successful. Please wait...');
              // vend airtime
              this.tv.VendTvSubscription(localStorage.getItem('locator'), this.refKey, this.amountToPay, this.token)
              .pipe( retry(3) )
              .subscribe( (data) => {
                if (data.status === 200) {
                  this.notification.ShowAlert('Transaction successful.');
                  const body = data.body;
                  this.msg = body.msg;
                  this.navCtrl.push('TransactionDetailsTvPage',
                  {
                    reference: this.refKey,
                    status: event['data']['success'],
                    total: this.total,
                    refKey: this.refKey,
                    token: this.token,
                    amountToPay: this.amountToPay,
                    transactionID: this.transactionID,
                    customerName: this.customerName
                  });
                } else {
                  this.notification.ShowAlert(data.statusText);
                }
              }, error => {
                this.notification.ShowAlert(error.message);
              });
            }
            browser.close();
          }
        });
      }).catch(error => {
        // Error or invalid paymentObject passed in
        console.log('flutterwave error');
        console.log(error);
        // this.notification.ShowAlert(error.message);
      });
    });
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
