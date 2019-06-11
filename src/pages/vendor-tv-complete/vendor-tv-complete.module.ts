import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VendorTvCompletePage } from './vendor-tv-complete';

@NgModule({
  declarations: [
    VendorTvCompletePage,
  ],
  imports: [
    IonicPageModule.forChild(VendorTvCompletePage),
  ],
  exports: [
    VendorTvCompletePage
  ]
})
export class VendorTvCompletePageModule {}
