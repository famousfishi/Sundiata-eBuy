import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransactionDetailsAirtimePage } from './transaction-details-airtime';

@NgModule({
  declarations: [
    TransactionDetailsAirtimePage,
  ],
  imports: [
    IonicPageModule.forChild(TransactionDetailsAirtimePage),
  ],
})
export class TransactionDetailsAirtimePageModule {}
