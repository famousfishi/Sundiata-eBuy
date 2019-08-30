import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ModalController } from 'ionic-angular';
import { AllServicesProvider } from '../../providers/all-services/all-services';
import { VendorProvider } from '../../providers/vendor/vendor';
import { PaginationProvider } from '../../providers/pagination/pagination';
import { retry } from 'rxjs/operators';
import { VendorTransactions } from '../../providers/vendor-structures/vendor-structures';
import { NotificationProvider } from '../../providers/notification/notification';

/**
 * Generated class for the VendorPowerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-vendor-power',
  templateUrl: 'vendor-power.html',
})
export class VendorPowerPage {

  states: any;
  transaction = {
    state: 15,
    stateText: 'FCT',
    meterType: 1,
    meterNo: '',
    email: '',
    phone: '',
    amount: 1000,
    disco: 1
  };
  user: any;
  hideLagos = false;
  btnDisabled = false;
  powerMenu: string = 'fresh';
  transactionsHistory: VendorTransactions;
  presentHistory: any;
  historyPage: number = 0;
  constructor(
    public navCtrl: NavController, public navParams: NavParams,
    private services: AllServicesProvider, private vendor: VendorProvider,
    public pagination: PaginationProvider, private appCtrl: App,
    private notification: NotificationProvider, private modalCtrl: ModalController) {
    this.user = JSON.parse(localStorage.getItem('user'));
    console.log('user');
    console.log(this.user);
    this.transaction.email = this.user.email;
    this.services.getStates().then(data=>{
      console.log(data);
      this.states = data
    });
    this.GetHistory();
  }

  ionViewWillEnter() {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VendorPowerPage');
  }

  ChangeState($stateId: number, $text: string): void {
    this.transaction.state = $stateId;
    this.transaction.stateText = $text;
    console.log(`Selected state: ${$text}`);
    if ($stateId == 25 || $text == 'Lagos') {
      this.hideLagos = true;
    } else {
      this.hideLagos = false;
    }
  }

  ChangeMeterType($meterType): void {
    this.transaction.meterType = $meterType;
  }

  ValidateData(): boolean {
    if (this.transaction.state) {
      if (this.transaction.meterType) {
        if (this.transaction.meterNo) {
          if (this.transaction.email) {
            if (this.transaction.phone) {
              if (this.transaction.amount) {
                return true;
              } else {
                this.notification.ShowAlert('Please enter amount');
              }
            } else {
              this.notification.ShowAlert('Please enter recipient email');
            }
          } else {
            this.notification.ShowAlert('Please enter recipient email');
          }
        } else {
          this.notification.ShowAlert('Please enter your meter number');
        }
      } else {
        this.notification.ShowAlert('Please select a meter type');
      }
    } else {
      this.notification.ShowAlert('Please select a state');
    }
    return false;
  }

  VerifyMeter($event: any): void {
    this.btnDisabled = true;
    if (this.ValidateData()) {
      const modal = this.modalCtrl.create('VendorPowerCompletePage', { transaction: this.transaction });
      modal.present();
    }
    this.btnDisabled = false;
  }

  SwipeEvent($event, $side): void {
    if ($side == 1) {
      this.powerMenu = 'history';
    } else {
      this.powerMenu = 'fresh';
    }
  }

  GetHistory(): void {
    this.vendor.GetPowerTransactionHistory(20, 'all')
    .pipe( retry(3) )
    .subscribe( (data) => {
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
