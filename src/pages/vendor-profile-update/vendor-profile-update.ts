import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, App } from 'ionic-angular';
import { VendorProvider } from '../../providers/vendor/vendor';
import { NotificationProvider } from '../../providers/notification/notification';
import { AllServicesProvider } from '../../providers/all-services/all-services';
import { retry } from 'rxjs/operators';

/**
 * Generated class for the VendorProfileUpdatePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-vendor-profile-update',
  templateUrl: 'vendor-profile-update.html',
})
export class VendorProfileUpdatePage {

  user: any;
  states: any;
  btnDisabled: boolean = false;
  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    private viewCtrl: ViewController, private vendor: VendorProvider,
    private notification: NotificationProvider, private services: AllServicesProvider,
    private appCtrl: App
    ) {
      this.user = JSON.parse(localStorage.getItem('user'));
      this.services.getStates()
      .then( data => {
        console.log(data);
        this.states = data
      })
      .catch( err => {
        console.log(err);
        this.notification.ShowToast('Unable to load states. Please pull to refresh and try again.');
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VendorProfileUpdatePage');
  }

  ChangeState(stateId: number, stateText: string) {
    this.user.vendor.state_id = stateId;
    console.log(`Business state: ${stateText}`);
  }

  ValidateData(): boolean {
    if (this.user.vendor.business_name) {
      if (this.user.vendor.address) {
        if (this.user.vendor.city) {
          if (this.user.vendor.state_id) {
            return true;
          } else {
            this.notification.ShowAlert('Please select your state!');
          }
        } else {
          this.notification.ShowAlert('Please enter your city!');
        }
      } else {
        this.notification.ShowAlert('Please enter your address!');
      }
    } else {
      this.notification.ShowAlert('Please enter a business name!');
    }
    return false;
  }

  UpdateProfile($event): void {
    this.btnDisabled = true;
    this.notification.ShowLoading('Validating data...');
    if (this.ValidateData()) {
      this.notification.ShowLoading('Updating profile...');
      this.vendor.UpdateVendorProfile(
        this.user.vendor.business_name, this.user.vendor.address, this.user.vendor.city,
        this.user.vendor.state_id, this.user.vendor.alt_phone, this.user.vendor.website,
        this.user.vendor.office_phone, this.user.vendor.office_email
      )
      .pipe( retry(3) )
      .subscribe( (data) => {
        if (data.status === 200) {
          const body = data.body;
          if (body.validation) {
            const validationErrors = body.message;
            if (validationErrors.business_name) {
              this.notification.ShowAlert(validationErrors.business_name);
            }
            if (validationErrors.address) {
              this.notification.ShowAlert(validationErrors.address);
            }
            if (validationErrors.city) {
              this.notification.ShowAlert(validationErrors.city);
            }
            if (validationErrors.state_id) {
              this.notification.ShowAlert('Please select your state.');
            }
            if (validationErrors.alt_phone) {
              this.notification.ShowAlert(validationErrors.alt_phone);
            }
            if (validationErrors.website) {
              this.notification.ShowAlert(validationErrors.website);
            }
            if (validationErrors.office_phone) {
              this.notification.ShowAlert(validationErrors.office_phone);
            }
            if (validationErrors.office_email) {
              this.notification.ShowAlert(validationErrors.office_email);
            }
          } else {
            if (body.status) {
              this.notification.ShowToast(body.message);
              this.vendor.GetVendorProfile()
              .pipe( retry(3) )
              .subscribe( (data) => {
                if (data.status === 200) {
                  const body = data.body;
                  if (body.status) {
                    localStorage.setItem('user', JSON.stringify(body.profile));
                  } else {
                    this.notification.ShowAlert(body.message);
                  }
                } else {
                  this.notification.ShowAlert(`Error processing request.`);
                }
              },
              error => {
                if (error.status === 419) {
                  this.viewCtrl.dismiss();
                  localStorage.clear();
                  this.notification.ShowAlert(`Unable to fetch transactions history. Previous session has expired. Please sign in again.`);
                  this.appCtrl.getRootNav().push('LoginPage');
                } else {
                  this.notification.ShowAlert(`Unable to complete request.`);
                }
              });
            } else {
              this.notification.ShowAlert(body.message);
            }
          }
        } else {
          this.notification.ShowAlert(`Error processing request.`);
        }
      },
      error => {
        if (error.status === 419) {
          this.viewCtrl.dismiss();
          localStorage.clear();
          this.notification.ShowAlert(`Unable to fetch transactions history. Previous session has expired. Please sign in again.`);
          this.appCtrl.getRootNav().push('LoginPage');
        } else {
          this.notification.ShowAlert(`Unable to complete request.`);
        }
      });
    }
    this.btnDisabled = false;
  }

  CloseModal() {
    this.viewCtrl.dismiss();
  }

}
