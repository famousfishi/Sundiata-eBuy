import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderConfirmAirtimePage } from './order-confirm-airtime';
import { Angular4PaystackModule } from 'angular4-paystack';
import { AngularRaveModule } from 'angular-rave';

@NgModule({
  declarations: [
    OrderConfirmAirtimePage,
  ],
  imports: [
    IonicPageModule.forChild(OrderConfirmAirtimePage),
    Angular4PaystackModule,
    AngularRaveModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
})
export class OrderConfirmAirtimePageModule {}
