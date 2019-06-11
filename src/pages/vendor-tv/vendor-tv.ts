import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, App } from 'ionic-angular';
import { AllServicesProvider } from '../../providers/all-services/all-services';
import { NotificationProvider } from '../../providers/notification/notification';
import { PaginationProvider } from '../../providers/pagination/pagination';
import { VendorProvider } from '../../providers/vendor/vendor';
import { retry } from 'rxjs/operators';
import { VendorTransactions } from '../../providers/vendor-structures/vendor-structures';

/**
 * Generated class for the VendorTvPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-vendor-tv',
  templateUrl: 'vendor-tv.html',
})
export class VendorTvPage {

  transaction = {
    provider: '',
    providerID: '',
    package: '',
    packageID: '',
    packageAmount: '',
    smartCard: '',
    email: '',
    phone: ''
  };
  user: any;
  packages: any;
  tvServices: any;
  presentHistory: any;
  historyPage: number = 0;
  tvMenu: string = 'fresh';
  transactionsHistory: VendorTransactions;
  hasPackages: boolean = false;
  btnDisabled: boolean = false;
  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    private services: AllServicesProvider, private notification: NotificationProvider,
    private modalCtrl: ModalController, public pagination: PaginationProvider,
    private vendor: VendorProvider, private appCtrl: App
    ) {
      this.user = JSON.parse(localStorage.getItem('user'));
      this.transaction.email = this.user.email;
      this.services.getTvService()
      .then( data => {
        console.log('TV services:');
        console.log(data);
        this.tvServices = data;
      }).catch(error => {
        this.notification.ShowAlert(`Unable to load services. Please pull page to refresh and try again.`);
        console.log("Error getting tv services");
        console.log(error);
      });
      this.GetHistory();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VendorTvPage');
  }

  ChangeProvider($providerID: any, $providerText: any) {
    console.log('called to change tv provider');
    this.transaction.provider = $providerText;
    this.transaction.providerID = $providerID;
    if (this.transaction.provider === 'StarTimes') {
      this.transaction.packageID = this.transaction.packageAmount;
    }
    this.services.getTvInfo($providerID)
    .then( data => {
      console.log('plans for selected provider.');
      console.log(data);
      if (data == '404'){
        this.notification.ShowAlert('We currently do not have any subscription plans for the selected provider.');
      } else {
        this.packages = data;
        this.hasPackages = true;
      }
    })
    .catch( error => {
      console.log('error fetching subscription plans');
      console.log(error);
      this.notification.ShowAlert(`Error processing request. Unable to fetch subscription plans.`);
    })
  }

  ChangePackage($packageID: any, $packageText: any) {
    this.transaction.packageID = $packageID;
    this.transaction.package = $packageText;
    console.log(`Selected package Id: ${$packageID} and name: ${$packageText}`);
    const selectedBundle = this.packages.find( (b: any) => {
      return b.id == $packageID;
    });
    this.transaction.packageAmount = selectedBundle.amount;
    console.log('package amount: ' + selectedBundle.amount);
  }

  SwipeEvent($event, $side) {
    if ($side == 1) {
      this.tvMenu = 'history';
    } else {
      this.tvMenu = 'fresh';
    }
  }

  ValidateData() {
    if (this.transaction.email) {
      if (this.transaction.packageID) {
        if (this.transaction.phone) {
          if (this.transaction.providerID) {
            if (this.transaction.smartCard) {
              return true;
            } else {
              this.notification.ShowAlert('Please enter smart card number.');
            }
          } else {
            this.notification.ShowAlert('Please select a Provider.');
          }
        } else {
          this.notification.ShowAlert('Please enter recipient number.');
        }
      } else {
        this.notification.ShowAlert('Please select a package.');
      }
    } else {
      this.notification.ShowAlert('Please enter recipient e-mail.');
    }
  }

  VerifySmartCard() {
    this.btnDisabled = true;
    console.log('transaction details');
    console.log(this.transaction);
    if (this.ValidateData()) {
      const modal = this.modalCtrl.create('VendorTvCompletePage', { transaction: this.transaction });
      modal.present();
    }
    this.btnDisabled = false;
  }

  GetHistory(): void {
    this.vendor.GetTvTransactionHistory(20, 'all')
    .pipe( retry(3) )
    .subscribe( (data) => {
      console.log('tv transactions history');
      console.log(data);
      if (data.status === 200) {
        const body = data.body;
        if (body.status) {
          this.transactionsHistory = body;
          if ( this.transactionsHistory && this.transactionsHistory.status ) {
            this.pagination.Collections     = this.transactionsHistory.transactions;
            this.pagination.ItemsPerPage    = 20;
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
        this.notification.ShowAlert(`Error processing request.`);
      }
    },
    error => {
      if (error.status === 419) {
        this.notification.ShowAlert(`Unable to fetch transactions history. Previous session has expired. Please sign in again.`);
        localStorage.clear();
        this.appCtrl.getRootNav().push('LoginPage');
      } else {
        this.notification.ShowAlert(`Unable to fetch transactions history.`);
      }
    });
  }

  DoInfiniteScroll(infiniteScroll: any): void {
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
