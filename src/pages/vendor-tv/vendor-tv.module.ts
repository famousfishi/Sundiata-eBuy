import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VendorTvPage } from './vendor-tv';

@NgModule({
  declarations: [
    VendorTvPage,
  ],
  imports: [
    IonicPageModule.forChild(VendorTvPage),
  ],
  exports: [
    VendorTvPage
  ]
})
export class VendorTvPageModule {}
