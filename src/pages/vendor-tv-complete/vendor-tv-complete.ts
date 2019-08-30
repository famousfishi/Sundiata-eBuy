import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ViewController } from 'ionic-angular';
import { NotificationProvider } from '../../providers/notification/notification';
import { VendorProvider } from '../../providers/vendor/vendor';
import { retry } from 'rxjs/operators';

/**
 * Generated class for the VendorTvCompletePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-vendor-tv-complete',
  templateUrl: 'vendor-tv-complete.html',
})
export class VendorTvCompletePage {

  card: any;
  transaction: any;
  transactionID: string;
  verified: boolean = false;
  btnDisabled: boolean = false;
  constructor(
    public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController,
    private notification: NotificationProvider, private appCtrl: App, private vendor: VendorProvider) {
    this.transaction = this.navParams.get('transaction');
  }

  ionViewWillEnter(){
    this.VerifyMeterNumber();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VendorTvCompletePage');
  }

  VerifyMeterNumber(): void {
    this.notification.ShowLoading('Verifying smart card details...');
    this.vendor.RegisterTvTransaction(
      this.transaction.package, this.transaction.packageID, this.transaction.provider,
      this.transaction.providerID, this.transaction.smartCard, this.transaction.packageAmount,
      this.transaction.email, this.transaction.phone
    )
    .pipe( retry(3) )
    .subscribe( (data) => {
      if ( data.status === 200) {
        const body = data.body;
        if (body.validation) {
          const validationErrors = body.msg;
          if (validationErrors.service_id) {
            this.notification.ShowAlert('Select a subscription provider');
          } else if (validationErrors.smartcard_num) {
            this.notification.ShowAlert(validationErrors.smartcard_num);
          } else if (validationErrors.amount) {
            this.notification.ShowAlert(validationErrors.amount);
          } else if (validationErrors.email) {
            this.notification.ShowAlert(validationErrors.email);
          } else if (validationErrors.phone) {
            this.notification.ShowAlert(validationErrors.phone);
          }
        } else {
          if (body.success) {
            this.card = body.msg;
            console.log('card details:');
            console.log(this.card);
            this.transactionID = body.ref;
            this.notification.ShowToast('Verification successful. Please confirm smart card details');
            this.verified = true;
          } else {
            this.notification.ShowAlert(body.msg);
          }
        }
      } else {
        this.notification.ShowAlert(`Unable to complete request: ${data.statusText}`);
      }
    },
    error => {
      if (error.status === 419) {
        this.notification.ShowAlert(`Unable to fetch transactions history. Previous session has expired. Please sign in again.`);
        localStorage.clear();
        this.viewCtrl.dismiss();
        this.appCtrl.getRootNav().push('LoginPage');
      } else {
        this.notification.ShowAlert(`Unable to complete request: ${error.message}`);
      }
    });
  }

  CompleteTransaction() {
    this.btnDisabled = true;
    this.vendor.RegisterTvTransactionComplete(this.transactionID)
    .pipe( retry(3) )
    .subscribe( (data) => {
      if (data.status === 200) {
        const body = data.body;
        if (body.success) {
          this.notification.ShowAlert('Transaction successfull.');
        } else {
          this.notification.ShowAlert(body.msg);
          this.btnDisabled = false;
        }
      } else {
        this.notification.ShowAlert(data.statusText);
        this.btnDisabled = false;
      }
    },
    error => {
      this.btnDisabled = false;
      if (error.status === 419) {
        this.notification.ShowAlert(`Unable to fetch transactions history. Previous session has expired. Please sign in again.`);
        localStorage.clear();
        this.appCtrl.getRootNav().push('LoginPage');
      } else {
        this.notification.ShowAlert(`Unable to complete request: ${error.message}`);
      }
    });
  }

  CloseModal() {
    this.viewCtrl.dismiss();
  }

}
