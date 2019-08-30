import { VendorTransactions } from './../../providers/vendor-structures/vendor-structures';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { AllServicesProvider } from '../../providers/all-services/all-services';
import { NotificationProvider } from '../../providers/notification/notification';
import { VendorProvider } from '../../providers/vendor/vendor';
import { retry } from 'rxjs/operators';
import { PaginationProvider } from '../../providers/pagination/pagination';

/**
 * Generated class for the VendorAirtimePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-vendor-airtime',
  templateUrl: 'vendor-airtime.html',
})
export class VendorAirtimePage {

  transaction = {
    phone: '',
    network: 1,
    email: '',
    amount: 100
  };
  networks;
  user: any;
  btnDisabled = false;
  menu: string = 'fresh';
  presentHistory: any;
  historyPage: number = 0;
  transactionsHistory: VendorTransactions;
  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    private services: AllServicesProvider, private notification: NotificationProvider,
    private vendor: VendorProvider, public pagination: PaginationProvider, private appCtrl: App) {
      this.pagination.Collections = ['a', 'b', 'c', 'd', 'e', 'f'];
      this.pagination.ItemsPerPage = 4;
      console.log(`Page Count: ${this.pagination.PageCount}`);
      console.log(`Item Count: ${this.pagination.ItemCount}`);
      console.log(`Item Count On Page 0: ${this.pagination.PageItemCount(0)}`);
      console.log(`Item Count On Page 1: ${this.pagination.PageItemCount(1)}`);
      console.log(`Item Count On Page 2: ${this.pagination.PageItemCount(2)}`);
      this.services.getAirtimeService()
      .then(data => {
        this.networks = data;
      }).catch(error => {
        console.log('error fetching networks');
        console.log(error);
        this.notification.ShowAlert(error.message);
      });
      this.user = JSON.parse(localStorage.getItem('user'));
      if (!this.user || this.user == undefined  ) {
        this.notification.ShowAlert('Session expired! Please sign in to continue');
        localStorage.clear();
        this.appCtrl.getRootNav().push('LoginPage');
      }
      this.transaction.email = this.user.email;
      this.GetHistory();
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VendorAirtimePage');
  }

  ChangeNetwork($id) {
    this.transaction.network = $id;
  }

  ValidateData() {
    if (this.transaction.phone) {
      if (this.transaction.phone.toString().length === 11) {
        if (this.transaction.amount) {
          if (this.transaction.amount > 50) {
            if (this.transaction.email) {
              if (this.transaction.network) {
                return true;
              } else {
                this.notification.ShowAlert('Please select a network!');
              }
            } else {
              this.notification.ShowAlert('E-mail field is required!');
            }
          } else {
            this.notification.ShowAlert('You cannot purchase lesser than NGN50 Airtime');
          }
        } else {
          this.notification.ShowAlert('Amount field is required!');
        }
      } else {
        this.notification.ShowAlert('Phone number cannot be more than 11 characters');
      }
    } else {
      this.notification.ShowAlert('Phone number is required!');
    }
  }

  VendAirtime($event: any) {
    this.btnDisabled = true;
    this.notification.ShowLoading('Transaction processing...');
    if (this.ValidateData()) {
      this.vendor.RegisterAirtimeTransaction(this.transaction.phone, this.transaction.network, this.transaction.email, this.transaction.amount)
      .pipe( retry(3) )
      .subscribe( (data) => {
        if (data.status === 200) {
          const body = data.body;
          if (body.validation) {
            const validationFields: any = body.msg;
            if (validationFields.email) {
              this.notification.ShowAlert(validationFields.email);
            } else if (validationFields.phone) {
              this.notification.ShowAlert(validationFields.phone);
            } else if (validationFields.network) {
              this.notification.ShowAlert(validationFields.netowrk);
            } else if (validationFields.amount) {
              this.notification.ShowAlert(validationFields.amount);
            }
          } else {
            if (body.success) {
              this.notification.ShowAlert(body.msg);
              this.GetHistory();
            } else {
              this.notification.ShowAlert(body.msg);
            }
          }
        } else {
          this.notification.ShowAlert(`${data.statusText}`);
        }
      },
      error => {
        if (error.status === 419) {
          this.notification.ShowAlert('Unable to complete transaction! Previous session has expired, please sign in again.');
          localStorage.clear();
          this.appCtrl.getRootNav().push('LoginPage');
        } else {
          this.notification.ShowAlert(`Unable to complete transaction: ${error.message}`);
        }
      });
    }
    this.btnDisabled = false;
  }

  SwipeEvent($event: any, $side: number) {
    if ($side == 1) {
      this.menu = 'history';
    } else {
      this.menu = 'fresh';
    }
  }

  GetHistory(): void {
    this.vendor.GetAirtimeTransactionHistory(20, 'all')
    .pipe( retry(3) )
    .subscribe( (data) => {
      if (data.status === 200) {
        const body = data.body;
        if (body.status) {
          this.transactionsHistory = body;
          if ( this.transactionsHistory && this.transactionsHistory.status ) {
            this.pagination.Collections     = this.transactionsHistory.transactions;
            this.pagination.ItemsPerPage    = 6;
            if (this.pagination.ItemCount < this.pagination.ItemsPerPage) {
              this.pagination.ItemsPerPage = this.pagination.ItemCount;
            }
            this.presentHistory = new Array();
            for (let i = 0; i < this.pagination.ItemsPerPage; i++) {
              this.presentHistory.push(this.transactionsHistory.transactions[i]);
            }
          }
        } else {
          this.notification.ShowAlert(body.transactions);
        }
      } else {
        this.notification.ShowAlert(data.statusText);
      }
    },
    error => {
      if (error.status === 419) {
        this.notification.ShowAlert(`Unable to fetch transactions history. Previous session has expired. Please sign in again.`);
        localStorage.clear();
        this.appCtrl.getRootNav().push('LoginPage');
      } else {
        this.notification.ShowAlert(`Unable to fetch transactions history: ${error.message}`);
      }
    });
  }

  DoInfiniteScroll(infiniteScroll: any) {
    this.pagination.Collections     = this.transactionsHistory.transactions;
    this.pagination.ItemsPerPage    = this.pagination.ItemsPerPage += 6;
    this.historyPage += 1;
    if ( this.pagination.PageCount > 0 ) {
      setTimeout( () => {
        this.presentHistory = new Array();
        const offSet = this.pagination.PageItemCount(this.historyPage - 1);

        for (let i = 0; i < offSet; i++) {
          this.presentHistory.push(this.transactionsHistory.transactions[i]);
        }
        console.log('latest transaction history');
        console.log(this.presentHistory);
        infiniteScroll.complete();
      }, 1000);
    }
  }

  RefreshPage(refresher): void {
    console.log('refreshing page...');
    setTimeout( () => {
      this.GetHistory();
      refresher.complete();
      this.notification.ShowToast('Records updated.');
    }, 4000);
  }

}
