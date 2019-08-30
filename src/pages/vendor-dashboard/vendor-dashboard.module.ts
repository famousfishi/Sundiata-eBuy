import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { VendorDashboardPage } from './vendor-dashboard';
import { VendorTestComponent } from '../../components/vendor-test/vendor-test';

@NgModule({
  declarations: [
    VendorDashboardPage,
    VendorTestComponent
  ],
  imports: [
    IonicPageModule.forChild(VendorDashboardPage),
  ],
  exports: [
    VendorDashboardPage
  ]
})
export class VendorDashboardPageModule {}
