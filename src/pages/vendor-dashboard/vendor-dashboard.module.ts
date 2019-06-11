import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VendorDashboardPage } from './vendor-dashboard';

@NgModule({
  declarations: [
    VendorDashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(VendorDashboardPage),
  ],
  exports: [
    VendorDashboardPage
  ]
})
export class VendorDashboardPageModule {}
