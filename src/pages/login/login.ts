import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { VendorProvider } from '../../providers/vendor/vendor';
import { NotificationProvider } from '../../providers/notification/notification';
import { retry } from 'rxjs/operators';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  account = {
    email: '',
    password: ''
  };
  btnDisabled = false;
  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    private vendor: VendorProvider, private notification: NotificationProvider,
    private appCtrl: App) {
      if (localStorage.getItem('vendorToken')) {
        this.navCtrl.push('VendorDashboardPage');
      }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  validateData() {
    if ( this.account.email ) {
      if ( this.account.password ) {
        return true;
      } else {
        this.notification.ShowAlert('Please enter a valid password');
      }
    } else {
      this.notification.ShowAlert('Please enter a valid e-mail');
    }
  }

  SignIn($event: any) {
    if (this.validateData()) {
      this.vendor.LoginVendor(this.account.email, this.account.password)
      .pipe( retry(3) )
      .subscribe( (data) => {
        if (data.status === 200) {
          const body:any = data.body;
          if (body.status) {
            this.notification.ShowToast('Sign in successful.');
            localStorage.setItem('vendorToken', body.token);
            localStorage.setItem('user', JSON.stringify(body.account));
            this.appCtrl.getRootNav().push('VendorDashboardPage');
          } else {
            this.notification.ShowAlert(body.account);
          }
        } else {
          this.notification.ShowAlert(data.statusText);
        }
      },
      error => {
        console.log('login error');
        console.log(error);
        if (error.status === 500) {
          this.notification.ShowAlert(error.message);
        } else {
          this.notification.ShowAlert(error.message);
        }
      });
    }
  }

}
