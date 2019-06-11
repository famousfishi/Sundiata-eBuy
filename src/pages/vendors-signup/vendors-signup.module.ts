import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VendorsSignupPage } from './vendors-signup';

@NgModule({
  declarations: [
    VendorsSignupPage,
  ],
  imports: [
    IonicPageModule.forChild(VendorsSignupPage),
  ],
  exports: [
    VendorsSignupPage
  ]
})
export class VendorsSignupPageModule {}
