import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VendorProfileUpdatePage } from './vendor-profile-update';

@NgModule({
  declarations: [
    VendorProfileUpdatePage,
  ],
  imports: [
    IonicPageModule.forChild(VendorProfileUpdatePage),
  ],
  exports: [
    VendorProfileUpdatePage
  ]
})
export class VendorProfileUpdatePageModule {}
