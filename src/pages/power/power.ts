import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { AllServicesProvider } from '../../providers/all-services/all-services';

/**
 * Generated class for the PowerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-power',
  templateUrl: 'power.html',
})
export class PowerPage {
 
  stateMethod: any;
  states: any;
  pickedStates: any[];
  pickedStateMethod: any;
  meterNo: number;
  phone: number;
  email: string = "";
  amount: number;
  convenienceFee: number = 100;
  meterTypeMethod: any;
  meterTypes: any[];
  discoMethod: number;

  //disco : number = 0;
  token: number;
  serviceProvider: string;
  amountPaid: number;
  refKey: any;
  selectedState:string = '';
  selectedStateValue: number;
  selectedDisco: number = 0;
  showStatus: string = 'hideit';
  userDisco:any;
  dataText: any;
  meterText: any;
  name: void;
  providerElectricity: any;
  


  constructor(public navCtrl: NavController, public toastCtrl: ToastController, 
    public navParams: NavParams, public loadCtrl: LoadingController, 
  public allServices: AllServicesProvider) {
   


    this.meterTypes = [
      {meterType_id: "prepaid", meterType_name: "Prepaid", meterType_no: 1},
      {meterType_id: "postpaid", meterType_name: "Postpaid", meterType_no: 2},
    ]

    

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PowerPage');
    // console.log(this.gLocatorID);
    console.log("From Order Confirm: " + localStorage.getItem("locator"));
  }

  ionViewWillEnter(){
    this.refKey = this.randomInt();

    console.log('refKey is : ' + this.refKey);

    this.allServices.getStates().then(data=>{
      console.log(data);
      this.states = data
    })
  }

  randomInt(){
    return Math.random().toString().slice(2,12);
  }

  confirm(){


    let reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    //let stateData: any = {};
    this.states.forEach((item, index)=>{
      if(item.state_no == this.stateMethod){
      //  stateData = item;
      }
     
    });

      if(!this.stateMethod){
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
      }else {
       

        if(this.selectedStateValue != 25) {
          this.userDisco = 0;
        }

        // make a call to the get meter info first 
        this.allServices.getMeterInfo(
          this.stateMethod,
          this.meterTypeMethod,
          this.meterNo,
          this.amount,
          this.email,
          this.phone,
          localStorage.getItem("locator"),
        this.dataText,
        this.userDisco,

        

        ).then(data=>{

          this.loadCtrl.create({
            content:'Please wait',
            duration: 5000
          }).present();
         
         this.token = data['token'];
         this.serviceProvider = data['serviceProvider'];
         this.amountPaid = data['amount'];
         this.providerElectricity = data['msg']['util'];
         this.name = data['msg']['name']; 
          console.log(data);
          console.log(this.token);
          console.log(this.serviceProvider);
          console.log(this.amountPaid);
          console.log(this.name);
          console.log(this.providerElectricity);

           this.loadCtrl.create({
          content:'Please wait',
          duration: 3000
        }).present();
          
          this.navCtrl.push('OrderConfirmPage', {
          
            stateMethod: this.stateMethod,
            dataText: this.dataText,
            meterText: this.meterText,
            meterTypeMethod: this.meterTypeMethod,
             meterNo:this.meterNo,
            phone: this.phone, 
            email: this.email,
             amount: this.amount,
             pickedStateMethod: this.pickedStateMethod,
             userDisco: this.userDisco,
             
             token: this.token,
             amountPaid : this.amountPaid,
             refKey: this.refKey,
             providerElectricity: this.providerElectricity,
             name: this.name,
             serviceProvider: this.serviceProvider
  
  
        
          });
        }).catch(error=>{
          console.log(error);
        });
      }
      
  

    
    

    
    

  }

  resetMe(){
    
    
  }

  setPowerState(text, value) {
    this.selectedState = text.toLowerCase();
    this.selectedStateValue = value;
    console.log("Selected State = " + this.selectedState);
    if(text == 'lagos' || text == 'Lagos' || value == 25) {
      console.log('Lagos state');
      this.showStatus = 'showit';
    } else {
      this.showStatus = 'hideit';
      console.log('Lagos state was not selected!' + this.selectedState);
    }
    console.log(this.selectedState);
    console.log(':-(');

    this.dataText = text;
    console.log('data Text is' + this.dataText);
  }

  setMeterState(text){
    this.meterText = text
    console.log('meter type text is ' + this.meterText);
  }

}
