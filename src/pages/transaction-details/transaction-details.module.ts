import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransactionDetailsPage } from './transaction-details';

@NgModule({
  declarations: [
    TransactionDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(TransactionDetailsPage),
  ],
})
export class TransactionDetailsPageModule {}
