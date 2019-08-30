import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

/**
 * Generated class for the VendorDashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-vendor-dashboard',
  templateUrl: 'vendor-dashboard.html',
})
export class VendorDashboardPage {

  profileTab;
  airtimeTab;
  powerTab;
  dataTab;
  tvTab;
  isAndroid = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, platform: Platform) {
    this.isAndroid = platform.is('Android');
    this.airtimeTab = 'VendorAirtimePage';
    this.powerTab   = 'VendorPowerPage';
    this.dataTab    = 'VendorDataPage';
    this.tvTab      = 'VendorTvPage';
    this.profileTab = 'VendorProfilePage';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VendorDashboardPage');
  }

}
