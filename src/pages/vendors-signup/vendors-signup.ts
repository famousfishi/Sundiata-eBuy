import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NotificationProvider } from '../../providers/notification/notification';
import { retry } from 'rxjs/operators';
import { VendorProvider } from '../../providers/vendor/vendor';

/**
 * Generated class for the VendorsSignupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-vendors-signup',
  templateUrl: 'vendors-signup.html',
})
export class VendorsSignupPage {

  public vendor = {
    fname: '',
    lname: '',
    email: '',
    phone: '',
    password: '',
    cPassword: '',
    promote: false
  };
  btnDisabled = false;
  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    private notification: NotificationProvider, private vendorProvider: VendorProvider) {
      if (localStorage.getItem('vendorToken')) {
        this.navCtrl.push('VendorDashboardPage');
      }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VendorsSignupPage');
  }

  validateData() {
    if (this.vendor.fname) {
      if (this.vendor.lname) {
        if (this.vendor.email) {
          if (this.vendor.phone) {
            if (this.vendor.password) {
              if (this.vendor.cPassword) {
                if (this.vendor.password === this.vendor.cPassword) {
                  return true;
                } else {
                  this.notification.ShowAlert('Passwords do not match.');
                }
              } else {
                this.notification.ShowAlert('Confirm Password is required.');
              }
            } else {
              this.notification.ShowAlert('Password is required.');
            }
          } else {
            this.notification.ShowAlert('Please enter your phone number.');
          }
        } else {
          this.notification.ShowAlert('Please enter your e-mail.');
        }
      } else {
        this.notification.ShowAlert('Please enter your last name.');
      }
    } else {
      this.notification.ShowAlert('Please enter your first name.');
    }
  }

  GoToLogin($event: any) {
    this.navCtrl.push('LoginPage');
  }

  RegisterVendor(event: any) {
    this.btnDisabled = true;
    this.notification.ShowLoading('Please wait...');
    if (this.validateData()) {
      this.vendorProvider.RegisterVendor(
        this.vendor.fname, this.vendor.lname, this.vendor.email, this.vendor.phone, this.vendor.password, this.vendor.cPassword, this.vendor.promote
      )
      .pipe( retry(3) )
      .subscribe( (data) => {
        console.log(data);
        if (data.status === 200) {
          const body = data.body;
          if (body.validation) {
            const validationFields: any = body.message;
            if (validationFields.fname) {
              this.notification.ShowAlert(validationFields.fname);
            } else if (validationFields.lname) {
              this.notification.ShowAlert(validationFields.lname);
            } else if (validationFields.email) {
              this.notification.ShowAlert(validationFields.email);
            } else if (validationFields.phone) {
              this.notification.ShowAlert(validationFields.phone);
            } else if (validationFields.password) {
              this.notification.ShowAlert(validationFields.password);
            }
          } else {
            if (body.success) {
              localStorage.clear();
              this.notification.ShowAlert(body.message);
              this.navCtrl.push('LoginPage');
            } else {
              this.notification.ShowAlert(body.message);
            }
          }
        } else {
          this.notification.ShowAlert(data.statusText);
        }
      },
      error => {
        console.log('error trying to register vendor');
        console.log(error);
        this.notification.ShowAlert(error.message);
      });
    }
    this.btnDisabled = false;
  }

}
