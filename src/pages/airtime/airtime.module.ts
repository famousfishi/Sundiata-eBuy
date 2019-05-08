import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AirtimePage } from './airtime';

@NgModule({
  declarations: [
    AirtimePage,
  ],
  imports: [
    IonicPageModule.forChild(AirtimePage),
  ],
})
export class AirtimePageModule {}
