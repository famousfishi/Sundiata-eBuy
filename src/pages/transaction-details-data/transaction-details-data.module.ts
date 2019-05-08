import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransactionDetailsDataPage } from './transaction-details-data';

@NgModule({
  declarations: [
    TransactionDetailsDataPage,
  ],
  imports: [
    IonicPageModule.forChild(TransactionDetailsDataPage),
  ],
})
export class TransactionDetailsDataPageModule {}
