import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { AllServicesProvider } from '../../providers/all-services/all-services';

@IonicPage()
@Component({
  selector: 'page-data',
  templateUrl: 'data.html',
})
export class DataPage {
  
  districts: any;

   
  sState: any;
  sDistrict: any;
  phone: number;
  email: string;

  dataServices:any;

  dataText: any;
  dataBundle: any;

  amount: number;
 

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public loadCtrl : LoadingController, 
    public allServices: AllServicesProvider,
     public  toastCtrl: ToastController,
    public alertCtrl: AlertController) {
  

  }

  ionViewWillEnter() {
    this.allServices.getDataService()
    .then(data => {
      console.log('Data services:');
      console.log(data);
      this.dataServices = data;
    }).catch(error => {
      console.log("Error getting data services");
      console.log(error);
    });

    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DataPage');
  }

  setDistrictValues(sState, text) {
   
   this.allServices.getDataBundles(sState).then(data=>{
     console.log(data);
    if(data == '404')   {
        this.alertCtrl.create({
          title:'Sundiata Message',
          message: 'There are currently no services for this network',
          buttons: ['OK']
        }).present();
    } else {
      this.districts = data;
    }
   }).catch(error=>{
     console.log(error);
   });

    this.dataText = text;
    console.log('data Text is' + this.dataText);
   
  }


  
  


  confirm(){
    let reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/


   // let stateData : any = {};
    this.dataServices.forEach((element, index)=>{
      if(element.name == this.sState){
        //stateData = element;
      }
    });

   // let districtData : any = {};
    this.districts.forEach((element2, index)=>{
      if(element2.name == this.sDistrict){
       // districtData = element2;
      }
    });

    if(!this.sState){
    this.toastCtrl.create({
      message: 'Please fill all fields',
      duration: 3000
    }).present();
    return false;

  } else if(this.phone.toString().length > 11 || this.phone.toString().length < 11){
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
  
  else {

  

    this.loadCtrl.create({
      content: 'Please wait..',
      duration: 3000,
    }).present();

   
      this.navCtrl.push('OrderConfirmDataPage', { 
        phone: this.phone,
        email: this.email,
        sState: this.sState,
        sDistrict: this.sDistrict,
         dataText: this.dataText,
         dataBundle: this.dataBundle, 
         amount: this.amount
         
        });

      }
    }


    logText(text){
      this.dataBundle = text;
      let obj = this.districts.find((i) => {
        return i.name == text;
      });
      console.log(obj.amount);
      this.amount = obj.amount;
      console.log('Amount to be passed is: ' + this.amount);
    }

    

   

  }

 

