import { VendorTransactions } from './../../providers/vendor-structures/vendor-structures';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { AllServicesProvider } from '../../providers/all-services/all-services';
import { NotificationProvider } from '../../providers/notification/notification';
import { VendorProvider } from '../../providers/vendor/vendor';
import { retry } from 'rxjs/operators';
import { PaginationProvider } from '../../providers/pagination/pagination';

/**
 * Generated class for the VendorDataPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-vendor-data',
  templateUrl: 'vendor-data.html',
})
export class VendorDataPage {

  transaction = {
    network: 1,
    networkText: '',
    bundleID: 1,
    bundle: '',
    bundleAmount: '',
    email: '',
    phone: ''
  }
  user: any;
  dataBundles: any;
  dataNetworks: any;
  historyPage: number = 0;
  dataMenu: string = 'fresh';
  btnDisabled: boolean = false;
  hasDataBundles: boolean = false;
  transactionsHistory: VendorTransactions;
  presentHistory: any;
  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    private services: AllServicesProvider, private notification: NotificationProvider,
    private vendor: VendorProvider, public pagination: PaginationProvider, private appCtrl: App) {
      this.user = JSON.parse(localStorage.getItem('user'));
      this.transaction.email = this.user.email;
      this.services.getDataService()
      .then(data => {
        console.log('Data services:');
        console.log(data);
        this.dataNetworks = data;
      }).catch(error => {
        console.log("Error getting data services");
        console.log(error);
      });
      this.GetHistory();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VendorDataPage');
  }

  ChangeNetwork($networkID, $networkText) {
    this.services.getDataBundles($networkID)
    .then( data => {
      console.log(data);
      if(data === '404')   {
        this.notification.ShowAlert('We currently do not have any data plans for the selected network.');
      } else {
        this.dataBundles = data;
        this.hasDataBundles = true;
      }
    })
    .catch(error=>{
      console.log(error);
      this.notification.ShowAlert(error.message);
    });
    this.transaction.networkText = $networkText;
  }

  ChangeDataBundle($bundleID: any, $bundleText: any) {
    this.transaction.bundle = $bundleText;
    this.transaction.bundleID = $bundleID;
    console.log('selected bundle id: ' + $bundleID + ' and name = ' + $bundleText);
    const selectedBundle = this.dataBundles.find( (s: any) => {
      return s.id == $bundleID;
    });
    console.log('selected bundle:');
    console.log(selectedBundle);
    this.transaction.bundleAmount = selectedBundle.amount;
  }

  SwipeEvent($event: any, $side: number) {
    if ($side == 1) {
      this.dataMenu = 'history';
    } else {
      this.dataMenu = 'fresh';
    }
  }

  ValidateData() {
    if (this.transaction.network) {
      if (this.transaction.phone) {
        if (this.transaction.bundleID) {
          if (this.transaction.email) {
            return true;
          } else {
            this.notification.ShowAlert('Please enter recipient email address');
          }
        } else {
          this.notification.ShowAlert('Please select a data bundle plan.');
        }
      } else {
        this.notification.ShowAlert('Please enter recipient phone number');
      }
    } else {
      this.notification.ShowAlert('Please select a network provider.');
    }
  }

  VendData($event: any) {
    this.btnDisabled = true;
    this.notification.ShowLoading('Transaction processing...');
    this.vendor.RegisterDataTransaction(this.transaction.network, this.transaction.bundleID, this.transaction.phone, this.transaction.email)
    .pipe( retry(3) )
    .subscribe( (data) => {
      this.btnDisabled = false;
      if ( data.status === 200 ) {
        const body = data.body;
        if ( body.validation ) {
          const validationFields = body.msg;
          if (validationFields.phone) {
            this.notification.ShowAlert(validationFields.phone);
          } else if (validationFields.service_id) {
            this.notification.ShowAlert('Please select a valid network provider.');
          } else if (validationFields.data_bundles_id) {
            this.notification.ShowAlert('Please select a data bundle');
          } else if (validationFields.email) {
            this.notification.ShowAlert(validationFields.email);
          }
        } else {
          if ( body.success ) {
            this.notification.ShowAlert(body.msg);
            this.GetHistory();
            this.btnDisabled = false;
          } else {
            this.notification.ShowAlert(body.msg);
            this.btnDisabled = false;
          }
        }
      } else {
        this.notification.ShowAlert(`Error processing request.`);
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
        this.notification.ShowAlert(`Unable to complete request.`);
      }
    });
  }

  GetHistory(): void {
    this.vendor.GetDataTransactionHistory(20, 'all')
    .pipe( retry(3) )
    .subscribe( (data) => {
      if (data.status === 200) {
        console.log('data response');
        console.log(data);
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
