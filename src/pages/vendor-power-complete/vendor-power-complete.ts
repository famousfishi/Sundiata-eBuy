import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ViewController } from 'ionic-angular';
import { VendorProvider } from '../../providers/vendor/vendor';
import { NotificationProvider } from '../../providers/notification/notification';
import { retry } from 'rxjs/operators';

/**
 * Generated class for the VendorPowerCompletePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-vendor-power-complete',
  templateUrl: 'vendor-power-complete.html',
})
export class VendorPowerCompletePage {

  meter: any;
  token: string;
  transaction: any;
  amountToPay: number;
  transactionID: string;
  verified: boolean = false;
  provider;
  btnDisabled = false;
  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    private vendor: VendorProvider, private notification: NotificationProvider,
    private appCtrl: App, private viewCtrl: ViewController) {
      this.transaction = this.navParams.get('transaction');
      console.log('Parsed params');
      console.log(this.transaction);
      if ( this.transaction.stateText == 'Abuja' || this.transaction.stateText == 'Nassarawa' || this.transaction.stateText == 'Kogi' || this.transaction.stateText == 'Niger' || this.transaction.stateText == 'FCT' ) {
        if ( this.transaction.meterType == '1' ) {
          this.provider = 'AEDC';
        } else {
          this.provider = 'AEDC_Postpaid';
        }
      }
      if ( this.transaction.stateText == 'Kaduna' || this.transaction.stateText == 'Sokoto' || this.transaction.stateText == 'Kebbi' || this.transaction.stateText == 'Zamfara' ) {
        if(this.transaction.meterType === '2') {
          this.provider = 'Kaduna_Electricity_Disco_Postpaid';
        } else {
          this.provider = 'Kaduna_Electricity_Disco';
        }
      }
      if ( this.transaction.stateText == 'Plateau' || this.transaction.stateText == 'Bauchi' || this.transaction.stateText == 'Benue' || this.transaction.stateText == 'Gombe') {
        this.provider = 'Jos_Disco';
      }
      if ( this.transaction.stateText == 'Kano' || this.transaction.stateText == 'Jigawa' || this.transaction.stateText == 'Katsina') {
        this.provider = 'Kano_Electricity_Disco';
      }
      if ( this.transaction.stateText == 'Oyo' || this.transaction.stateText == 'Ibadan' || this.transaction.stateText == 'Osun' || this.transaction.stateText == 'Ogun' || this.transaction.stateText == 'Kwara') {
        this.provider = 'Ibadan_Disco_Prepaid';
      }
      if ( this.transaction.stateText == 'Rivers' || this.transaction.stateText == 'Cross river' || this.transaction.stateText == 'Akwa Ibom' || this.transaction.stateText == 'Bayelsa') {
        if(this.transaction.meterType === '2') {
          this.provider = 'PhED_Electricity';
        } else {
          this.provider = 'PH_Disco';
        }
      }
      if ( this.transaction.stateText == 'Delta' || this.transaction.stateText == 'Edo' || this.transaction.stateText == 'Ekiti' || this.transaction.stateText == 'Ondo') {
        this.provider = 'Benue_Disco';
      }
      if (this.transaction.stateText == 'Lagos') {
        if (this.transaction.disco === '1') {
          if(this.transaction.meterType === '2') {
            this.provider = 'Eko_Postpaid';
          } else {
            this.provider = 'Eko_Prepaid';
          }
        }
        if(this.transaction.disco === '2') {
          if(this.transaction.meterType === '2') {
            this.provider = 'Ikeja_Electric_Bill_Payment';
          } else {
            this.provider = 'Ikeja_Token_Purchase';
          }
        }
      }
      console.log(`Provider: ${this.provider}`);
  }

  ionViewWillEnter(){
    this.VerifyMeter();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VendorPowerCompletePage');
  }

  VerifyMeter() {
    this.notification.ShowLoading('Verifying meter details...');
    this.vendor.RegisterPowerTransaction(
      this.transaction.state, this.transaction.meterType, this.transaction.meterNo, this.transaction.amount,
      this.transaction.email, this.transaction.phone, this.transaction.stateText, this.transaction.disco
    )
    .pipe( retry(3) )
    .subscribe( (data) => {
      console.log('meter verification result');
      console.log(data);
      if (data.status === 200) {
        const body = data.body;
        if (body.validation) {
          const validationFields = body.msg;
          if (validationFields.stateID) {
            this.notification.ShowAlert('Please select a valid state');
          } else if (validationFields.meterType) {
            this.notification.ShowAlert('Please select a meter type');
          } else if (validationFields.amount) {
            this.notification.ShowAlert('Amount field is required');
          } else if (validationFields.email) {
            this.notification.ShowAlert('Please enter recipient e-mail address');
          } else if (validationFields.phone) {
            this.notification.ShowAlert('Please enter recipient phone number');
          }
        } else {
          if (body.success) {
            this.meter = body.msg;
            this.amountToPay = body.amount;
            this.transactionID = body.ref;
            this.verified = true;
            this.notification.ShowToast('Please confirm meter details.');
          } else {
            this.notification.ShowAlert(body.msg);
          }
        }
      } else {
        this.notification.ShowAlert(`Error processing request.`);
      }
    },
    error => {
      if (error.status === 419) {
        this.notification.ShowAlert(`Unable to fetch transactions history. Previous session has expired. Please sign in again.`);
        localStorage.clear();
        this.appCtrl.getRootNav().push('LoginPage');
      } else {
        this.notification.ShowAlert(`Unable to complete request.`);
      }
    });
  }

  CompleteTransaction() {
    this.btnDisabled = true;
    this.notification.ShowLoading('Transaction processing...');
    if (this.amountToPay < this.meter.msg.minimumAmount) {
      this.notification.ShowAlert(`Minimum payable amount for this meter is: ${this.meter.msg.minimumAmount}`);
    } else {
      this.vendor.RegisterPowerTransactionComplete(this.transactionID)
      .pipe( retry(3) )
      .subscribe( (data) => {
        if (data.status === 200) {
          const body = data.body;
          if (body.success) {
            this.token = body.msg;
            this.notification.ShowAlert('Transaction complete. See token below.');
          } else {
            this.notification.ShowAlert(body.msg);
            this.btnDisabled = false;
          }
        } else {
          this.notification.ShowAlert(`Error processing request.`);
          this.btnDisabled = false;
        }
      },
      error => {
        this.btnDisabled = false;
        if (error.status == 419) {
          this.notification.ShowAlert(`Unable to fetch transactions history. Previous session has expired. Please sign in again.`);
          localStorage.clear();
          this.appCtrl.getRootNav().push('LoginPage');
        } else {
          this.notification.ShowAlert(`Unable to complete request.`);
        }
      });
    }
  }

  CloseModal() {
    this.viewCtrl.dismiss();
  }

}
