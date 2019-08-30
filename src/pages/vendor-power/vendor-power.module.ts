import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VendorPowerPage } from './vendor-power';
// import { VendorPowerCompletePage } from '../vendor-power-complete/vendor-power-complete';

@NgModule({
  declarations: [
    VendorPowerPage,
  ],
  imports: [
    IonicPageModule.forChild(VendorPowerPage),
  ],
  exports: [
    VendorPowerPage
  ],
})
export class VendorPowerPageModule {}
