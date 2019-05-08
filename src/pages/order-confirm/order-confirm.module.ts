import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OrderConfirmPage } from './order-confirm';
import { Angular4PaystackModule } from 'angular4-paystack';
import { AngularRaveModule } from 'angular-rave';

@NgModule({
  declarations: [
    OrderConfirmPage,
  ],
  imports: [
    IonicPageModule.forChild(OrderConfirmPage),
    Angular4PaystackModule,
    AngularRaveModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
})
export class OrderConfirmPageModule {}
