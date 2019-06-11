import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, App } from 'ionic-angular';
import { NotificationProvider } from '../../providers/notification/notification';
import { VendorProvider } from '../../providers/vendor/vendor';
import { retry } from 'rxjs/operators';

/**
 * Generated class for the VendorProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-vendor-profile',
  templateUrl: 'vendor-profile.html',
})
export class VendorProfilePage {

  user: any;
  constructor(
    public navCtrl: NavController, public navParams: NavParams, private modalCtrl: ModalController,
    private notification: NotificationProvider, private vendor: VendorProvider, private appCtrl: App) {
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VendorProfilePage');
  }

  OpenUpdateModal() {
    const modal = this.modalCtrl.create('VendorProfileUpdatePage');
    modal.present();
  }

  RefreshPage(refresher): void {
    setTimeout( () => {
      this.vendor.GetVendorProfile()
      .pipe( retry(3) )
      .subscribe( (data) => {
        if (data.status === 200) {
          const body = data.body;
          if (body.status) {
            this.user = body.profile;
            localStorage.setItem('user', JSON.stringify(body.profile));
            // this.user = JSON.parse(localStorage.getItem('user'));
          } else {
            this.notification.ShowAlert(body.message);
          }
        } else {
          this.notification.ShowAlert(`Request not completed: ${data.statusText}`);
        }
      },
      error => {
        if (error.status === 419) {
          localStorage.clear();
          this.notification.ShowAlert(`Unable to fetch transactions history. Previous session has expired. Please sign in again.`);
          this.appCtrl.getRootNav().push('LoginPage');
        } else {
          this.notification.ShowAlert(`Unable to complete request: ${error.message}`);
        }
      });
      refresher.complete();
      this.notification.ShowToast('Records updated.');
    }, 4000);
  }

}
