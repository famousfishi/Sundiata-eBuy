import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderConfirmTvPage } from './order-confirm-tv';
import { Angular4PaystackModule } from 'angular4-paystack';
import { AngularRaveModule } from 'angular-rave';

@NgModule({
  declarations: [
    OrderConfirmTvPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderConfirmTvPage),
    Angular4PaystackModule,
    AngularRaveModule
  ],

  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
})
export class OrderConfirmTvPageModule {}
