import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {
  homePage;
  @ViewChild("content") childNavCtrl: NavController;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.homePage = 'HomePage';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuPage');
  }

  openPage(pageName: string){
    if(pageName == "register"){
      this.navCtrl.push('RegisterPage');
    }

    if(pageName == "login"){
      this.navCtrl.push('LoginPage');
    }

    if(pageName == "logout"){
      this.navCtrl.push('LoginPage');
    }

    if(pageName == "purchase"){
      this.navCtrl.push('MenuPage');
    }
    if(pageName == 'transaction-details'){
      this.navCtrl.push('TransactionDetailsPage');
    }
    if(pageName == 'about'){
      this.navCtrl.push('AboutPage');
    }
    
    if(pageName == "re-purchase"){
      this.navCtrl.push('MenuPage');
    }
    if(pageName == "review"){
      this.navCtrl.push('ReviewPage');
    }
    if(pageName == "contact-us"){
      this.navCtrl.push('ContactUsPage');
    }
    if(pageName =="faq"){
      this.navCtrl.push('FaqPage');
    }

    if(pageName == "transactions"){
      this.navCtrl.push('TransactionHistoryPage');
    }

  }

}
