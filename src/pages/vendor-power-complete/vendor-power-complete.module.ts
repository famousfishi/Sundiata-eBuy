import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VendorPowerCompletePage } from './vendor-power-complete';

@NgModule({
  declarations: [
    VendorPowerCompletePage,
  ],
  imports: [
    IonicPageModule.forChild(VendorPowerCompletePage),
  ],
  exports: [
    VendorPowerCompletePage
  ],
})
export class VendorPowerCompletePageModule {}
