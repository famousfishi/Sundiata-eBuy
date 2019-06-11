import { ToastController, LoadingController, AlertController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the NotificationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class NotificationProvider {

  public API_URL = "https://ebuy.sundiatapost.com/api";
  public PRODUCTION_FLAG = true;
  public FLUTTERWAVE_PUBLIC_KEY = 'FLWPUBK-fdd28b56a5a4b71905c27ff9dfb41245-X';
  public SERVER_HOST = 'https://ebuy.sundiatapost.com/';
  public TEST_SERVER_URL = 'https://ebuy.sundiatapost.com/api';
  constructor(
    public http: HttpClient,
    private toastCtrl: ToastController,
    private loadCtrl: LoadingController,
    private alertCtrl: AlertController) {
  }

  ShowToast($msg) {
    this.toastCtrl.create({
      message: $msg,
      duration: 2000
    }).present();
  }

  ShowLoading($msg) {
    this.loadCtrl.create({
      content: $msg,
      duration: 2000
    }).present();
  }

  ShowAlert($msg) {
    this.alertCtrl.create({
      message: $msg,
      buttons: ['OK']
    }).present();
  }

}
