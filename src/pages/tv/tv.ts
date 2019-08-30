import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import { AllServicesProvider } from '../../providers/all-services/all-services';
import { ServicesTvProvider } from '../../providers/services-tv/services-tv';
import { retry } from 'rxjs/operators';
import { NotificationProvider } from '../../providers/notification/notification';

@IonicPage()
@Component({
  selector: 'page-tv',
  templateUrl: 'tv.html',
})
export class TvPage {
  phone: number;
  email: string;
  smartCard: number;
  refKey: any;
  tvServices: any;
  sState: any;
  districts: any;
  sDistrict: any;
  packageBundle: any;
  dataText: any;
  amount: number;
  token: any;
  amountToPay: number;
  transactionID : any;
  customerName: any;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController,
     public navParams: NavParams,
     public loadCtrl: LoadingController, public allServices: AllServicesProvider,
     public alertCtrl: AlertController, private tv: ServicesTvProvider,
     private notification: NotificationProvider
     ) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TvPage');
    console.log("From Order Confirm: " + localStorage.getItem("locator"));
  }

  setDistrictValues(sState, text){
    this.allServices.getTvInfo(sState).then(data=>{
      console.log(data);

      if(data == '404'){
        this.alertCtrl.create({
          title:'Sundiata Message',
          message: 'There are currently no services for this Tv Provider',
          buttons: ['OK']
        }).present();
      }else{
        this.districts = data;
      }
    }).catch(error=>{
      console.log(error);
    })

    this.dataText = text;
    console.log('data Text is' + this.dataText);

  }

  ionViewWillEnter(){
    this.refKey = this.randomInt();


    console.log('refKey is : ' + this.refKey);

    this.allServices.getTvService()
    .then(data => {
      console.log('TV services:');
      console.log(data);
      this.tvServices = data;
    }).catch(error => {
      console.log("Error getting tv services");
      console.log(error);
    });
  }


  randomInt(){
    return Math.random().toString().slice(2,12);
  }

  confirm(){
    let reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

   // let tvData : any = {};
    this.tvServices.forEach((element, index)=>{
      if(element.name == this.sState){
       // tvData = element
      }
    });

  //  let districtData : any = {};
    this.districts.forEach((element2, index)=>{
      if(element2.name == this.sDistrict){
     //   districtData = element2
      }
    });
    console.log(this.sState);
    console.log(this.smartCard);
    console.log(this.amount);
    console.log(this.email);
    console.log(this.phone);
    console.log(localStorage.getItem("locator"));
    console.log(this.packageBundle);
    console.log(this.sDistrict);
    console.log(this.dataText);

    if(!this.sState){
      this.toastCtrl.create({
    message: 'Please fill all fields to continue',
     duration: 4000
   }).present();
   return false;
 } else if (this.phone.toString().length > 11 || this.phone.toString().length < 11){
   this.toastCtrl.create({
     message: 'Your phone number must be 11 digits',
     duration: 4000

   }).present();
   return false;

 }else if(!reg.test(this.email)){
   this.toastCtrl.create({
     message: 'Please put a valid email',
     duration: 4000

   }).present();
   return reg.test(String(this.email));
 } else {
    this.tv.ConfirmSmartCard(
      this.sState, this.smartCard, this.amount, this.email, this.phone, localStorage.getItem('locator'), this.packageBundle, this.sDistrict,
      this.dataText
    )
    .pipe( retry(3) )
    .subscribe( (data) => {
      if (data.status === 200) {
        const body = data.body;
        if (body.success) {
          this.notification.ShowLoading('Card confirmed. Please wait...');
          const util: any = body.msg;
          this.token = util.token;
          this.amountToPay = util.amountToPay;
          this.transactionID = util.transactionID;
          this.customerName = util.customerName;
          this.navCtrl.push('OrderConfirmTvPage', {
            phone: this.phone,
            email: this.email,
            sState: this.sState,
            sDistrict: this.sDistrict,
            dataText: this.dataText,
            packageBundle: this.packageBundle,
            amount: this.amount,
            smartCard: this.smartCard,
            token: this.token,
            amountToPay: this.amountToPay,
            transactionID: this.transactionID,
            customerName: this.customerName
          });
        } else {
          this.notification.ShowAlert(body.msg);
        }
      } else {
        this.notification.ShowAlert(data.statusText);
      }
    }, error => {
      this.notification.ShowAlert(error.message);
    });


    this.allServices.getCardInfo(
      this.sState,
      this.smartCard,
      this.amount,
      this.email,
      this.phone,
      localStorage.getItem("locator"),
      this.packageBundle,
      this.sDistrict,
      this.dataText
    ).then(data=>{
      this.token =  data['msg']['token'];
      this.amountToPay = data['msg']['amountToPay'];
      this.transactionID = data['msg']['transactionID'];
      this.customerName = data['msg']['customerName'];

      console.log(data);
      console.log(data['msg']['token']);
      console.log(data['msg']['amountToPay']);
      console.log(data['msg']['transactionID']);
      console.log(data['msg']['customerName']);

      this.loadCtrl.create({
        content: 'Please wait',
        duration: 5000
      }).present();

    this.navCtrl.push('OrderConfirmTvPage', {
      phone: this.phone,
      email: this.email,
      sState: this.sState,
       sDistrict: this.sDistrict,
       dataText: this.dataText,
       packageBundle: this.packageBundle,
       amount: this.amount,
       smartCard: this.smartCard,
       token: this.token,
       amountToPay: this.amountToPay,
       transactionID: this.transactionID,
       customerName: this.customerName


      });


    })
    .catch(error=>{
      console.log(error);
    });
  }
}


    logText(text, id){
      console.log('districts');
      console.log(this.districts);
      console.log('text');
      console.log(text);
      this.packageBundle = text;
      let o = this.districts.find((i) => {
        return i.id == id;
      });
      console.log(o.amount);
      this.amount = o.amount;
      console.log('Amount to be passed is: ' + this.amount);
    }


  }





