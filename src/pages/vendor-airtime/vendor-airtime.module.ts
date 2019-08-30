import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VendorAirtimePage } from './vendor-airtime';

@NgModule({
  declarations: [
    VendorAirtimePage,
  ],
  imports: [
    IonicPageModule.forChild(VendorAirtimePage),
  ],
  exports: [
    VendorAirtimePage
  ],
})
export class VendorAirtimePageModule {}
