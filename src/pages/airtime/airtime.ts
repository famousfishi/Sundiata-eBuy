import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { AllServicesProvider } from '../../providers/all-services/all-services';


@IonicPage()
@Component({
  selector: 'page-airtime',
  templateUrl: 'airtime.html',
})
export class AirtimePage {

  phone: number;
  amount: number;
  email: string;


  pReference: any;
  dataServices: any;
  sState: any;
  networkText: any;

  constructor(public navCtrl: NavController,
     public navParams: NavParams,
    public loadCtrl: LoadingController,
    public allServices: AllServicesProvider,
    public toastCtrl: ToastController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AirtimePage');
  }

  ionViewWillEnter(){
    this.allServices.getAirtimeService()
    .then(data => {
      console.log('Data services:');
      console.log(data);
      this.dataServices = data;
    }).catch(error => {
      console.log("Error getting data services");
      console.log(error);
    });
  }

  randomInt(){
    return Math.random().toString().slice(2,12);
  }



  confirm() {
    let reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/


    this.dataServices.forEach((element, index)=>{
      if(element.name == this.sState){

      }
    });
    console.log(this.sState + ' ' + this.phone + ' ' + this.email + ' ' + this.amount);


    if(!this.sState){
      this.toastCtrl.create({
        message: 'Please fill all fields to continue',
        duration: 4000

      }).present();
      return false;
    }
    else if(this.phone.toString().length > 11 || this.phone.toString().length < 11){
      this.toastCtrl.create({
        message: 'Your phone number must be 11 digits',
        duration: 4000

      }).present();
      return false;
    } else if(!reg.test(this.email)){
      this.toastCtrl.create({
        message: 'Please put a valid email',
        duration: 4000

      }).present();
      return reg.test(String(this.email));
    }
    else{
     this.loadCtrl.create({
       content: 'Please wait',
       duration: 3000
     }).present();

      this.navCtrl.push('OrderConfirmAirtimePage',
      {sState: this.sState,
         phone: this.phone,
         amount: this.amount,
        email: this.email,
        networkText: this.networkText
       })
    }


  }

  logText(text) {
    this.networkText = text;
  }


}
