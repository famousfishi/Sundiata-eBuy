import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TransactionDetailsTvPage } from './transaction-details-tv';

@NgModule({
  declarations: [
    TransactionDetailsTvPage,
  ],
  imports: [
    IonicPageModule.forChild(TransactionDetailsTvPage),
  ],
})
export class TransactionDetailsTvPageModule {}
