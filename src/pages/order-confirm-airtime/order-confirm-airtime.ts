import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { AllServicesProvider } from '../../providers/all-services/all-services';
import { RaveOptions } from 'angular-rave';
import { ServicesAirtimeProvider } from '../../providers/services-airtime/services-airtime';
import { retry } from 'rxjs/operators';
import { NotificationProvider } from '../../providers/notification/notification';
import { InAppBrowser, InAppBrowserObject, InAppBrowserEvent } from '@ionic-native/in-app-browser/ngx';
import { Rave, RavePayment } from 'rave-ionic3';


@IonicPage()
@Component({
  selector: 'page-order-confirm-airtime',
  templateUrl: 'order-confirm-airtime.html',
})
export class OrderConfirmAirtimePage {
  email: string;
  total: number;
  sState: any;
  convenienceFee: number;
  amount: number;
  paymentMethod: string;
  phone: string;
  refKey: any;
  reference: any;
  pReference: any;
  refBaba: number;
  id: number;
  gLocatorID: number;
  tNo: any;
  networkText: any;
  txref: any;
  msg: any;
  private paymentObject: any;
  locator: any;

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
    public alertCtrl: AlertController, public allServices: AllServicesProvider,
    private notification: NotificationProvider,private rave: Rave,
    private ravePayment: RavePayment,
    private iab: InAppBrowser,
    private airtime: ServicesAirtimeProvider) {
      this.locator = localStorage.getItem('locator');
      this.sState = this.navParams.get('sState');
      console.log(`network set from constructor ${this.sState}`);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderConfirmAirtimePage');
    console.log("From Order Confirm: " + localStorage.getItem("locator"));

  }


  ionViewWillEnter() {
    console.log('printing for airtime....');
    console.log(this.sState);

    console.log(this.phone = this.navParams.get('phone'));

    console.log(this.amount = parseInt(this.navParams.get('amount')));
    console.log(this.email = this.navParams.get('email'));

    this.total = this.amount;
    this.refKey = this.randomInt();
    this.networkText = this.navParams.get('networkText');

    console.log('refKey is : ' + this.refKey);

    this.paymentOptions.customer_phone = this.phone;
    this.paymentOptions.customer_email = this.email;
    this.paymentOptions.amount = this.total;
    this.paymentOptions.custom_description = "Payment for airtime purchase";
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


  // payment cancel
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

  payWithCard() {
    this.rave.init(this.notification.PRODUCTION_FLAG, this.notification.FLUTTERWAVE_PUBLIC_KEY)
    .then(_ => {
      this.paymentObject = this.ravePayment.create({
        customer_email: this.email,
        amount: this.amount,
        customer_phone: this.phone,
        currency: 'NGN',
        txref: this.refKey,
        redirect_url: `${this.notification.SERVER_HOST}mobile-requests/airtime/${this.locator}/${this.sState}`
      });
      console.log('payment object');
      console.log(this.paymentObject);
      this.rave.preRender(this.paymentObject)
      .then(secureLink => {
        secureLink = secureLink + ' ';
        const browser: InAppBrowserObject = this.rave.render(secureLink, this.iab);
        browser.on('loadstop')
        .subscribe((event: InAppBrowserEvent) => {
          if (event.url.indexOf(`${this.notification.SERVER_HOST}mobile-requests/airtime/${this.locator}/${this.sState}`) !== -1) {
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
              this.airtime.RequestAirtime(this.phone, this.email, this.amount, this.sState, this.refKey, localStorage.getItem('locator'))
              .pipe( retry(3) )
              .subscribe( (data) => {
                if (data.status === 200) {
                  const body = data.body;
                  if (body.success) {
                    this.notification.ShowAlert(body.msg);
                    this.navCtrl.push('TransactionDetailsPage', {
                      tNo: this.tNo,
                      gLocatorID: this.gLocatorID,
                      refKey: this.refKey,
                      msg: this.msg,
                      status: event['data']['success'],
                      total: this.total,
                    });
                  } else {
                    this.notification.ShowAlert(body.msg);
                  }
                } else {
                  this.notification.ShowAlert(data.statusText);
                }
              }, error => {
                console.log('vending error');
                console.log(error);
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


  // payment Done
  paymentSuccess(event) {

    this.allServices.airtimeReturn(
      this.phone,
      this.email,
      this.amount,
      this.sState,
      this.refKey,
      localStorage.getItem("locator")

    ).then(data => {
      console.log(data);

      this.pReference = this.txref;
      this.tNo = data['tNo'];
      this.msg = data['msg'];
      console.log(data['tNo']);
      console.log(data['msg']);


      this.refBaba = event.reference;


      console.log(event);
      if (event['respcode'] == "00") {
        this.loadCtrl.create({
          content: 'Please wait while we process your transaction',
          duration: 5000,
        }).present();

        this.navCtrl.push('TransactionDetailsPage',
          {
            tNo: this.tNo,
            gLocatorID: this.gLocatorID,
            refKey: this.refKey,
            msg: this.msg,
            status: event['data']['success'],
            total: this.total,
          });
      }


    }).catch(error => {
      console.log(error);
    });

  }

}
