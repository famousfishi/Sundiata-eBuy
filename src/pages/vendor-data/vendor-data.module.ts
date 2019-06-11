import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VendorDataPage } from './vendor-data';

@NgModule({
  declarations: [
    VendorDataPage,
  ],
  imports: [
    IonicPageModule.forChild(VendorDataPage),
  ],
  exports: [
    VendorDataPage
  ]
})
export class VendorDataPageModule {}
