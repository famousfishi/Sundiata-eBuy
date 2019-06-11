import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AllServicesProvider } from '../../providers/all-services/all-services';
import { RaveOptions } from 'angular-rave';
import { NotificationProvider } from '../../providers/notification/notification';
import { InAppBrowser, InAppBrowserObject, InAppBrowserEvent } from '@ionic-native/in-app-browser/ngx';
import { Rave, RavePayment } from 'rave-ionic3';
import { ServicesDataProvider } from '../../providers/services-data/services-data';
import { retry } from 'rxjs/operators';


@IonicPage()
@Component({
  selector: 'page-order-confirm-data',
  templateUrl: 'order-confirm-data.html',
})
export class OrderConfirmDataPage {
  paymentObject: any;
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
  locator: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams, public alertCtrl: AlertController,
    public loadCtrl: LoadingController, public allServices: AllServicesProvider,
    private notification: NotificationProvider,private rave: Rave,
    private ravePayment: RavePayment,
    private iab: InAppBrowser,
    private data: ServicesDataProvider) {
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
    this.locator = localStorage.getItem('locator');
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

  payWithCard() {
    this.rave.init(this.notification.PRODUCTION_FLAG, this.notification.FLUTTERWAVE_PUBLIC_KEY)
    .then(_ => {
      this.paymentObject = this.ravePayment.create({
        customer_email: this.email,
        amount: this.amount,
        customer_phone: this.phone,
        currency: 'NGN',
        txref: this.refKey,
        redirect_url: `${this.notification.SERVER_HOST}mobile-requests/data/${this.locator}/${this.sState}/${this.sDistrict}`
      });
      this.rave.preRender(this.paymentObject)
      .then(secureLink => {
        secureLink = secureLink + ' ';
        const browser: InAppBrowserObject = this.rave.render(secureLink, this.iab);
        browser.on('loadstop')
        .subscribe((event: InAppBrowserEvent) => {
          if (event.url.indexOf(`${this.notification.SERVER_HOST}mobile-requests/data/${this.locator}/${this.sState}/${this.sDistrict}`) !== -1) {
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
              // vend data
              this.data.VendDataSubscription(
                this.sState, this.sDistrict, this.email, this.phone, this.amount, this.amount_paid, this.refKey, localStorage.getItem('locator')
              )
              .pipe( retry(3) )
              .subscribe( (resp) => {
                if (resp.status === 200) {
                  const body = resp.body;
                  if (body.success) {
                    this.notification.ShowAlert('Transaction successful. Data subscription was successfully activated.');
                    this.tNo = body.tNo;
                    this.msg = body.msg;
                    this.navCtrl.push('TransactionDetailsDataPage',
                    {
                      reference: this.refKey,
                      status: event['data']['success'],
                      total: this.total,
                      tNo: this.tNo,
                      refKey: this.refKey
                    });
                  } else {
                    this.notification.ShowAlert(body.msg);
                  }
                } else {
                  this.notification.ShowAlert(resp.statusText);
                }
              }, error => {
                console.log('data vend error');
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
