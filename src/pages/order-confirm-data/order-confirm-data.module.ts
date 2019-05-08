import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderConfirmDataPage } from './order-confirm-data';
import { Angular4PaystackModule } from 'angular4-paystack';
import { AngularRaveModule } from 'angular-rave';


@NgModule({
  declarations: [
    OrderConfirmDataPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderConfirmDataPage),
    Angular4PaystackModule,
    AngularRaveModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
})
export class OrderConfirmDataPageModule {}
