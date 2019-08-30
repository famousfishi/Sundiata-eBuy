import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {LoadingController, AlertController} from 'ionic-angular';
import { retry } from 'rxjs/operators';
import 'rxjs/add/operator/toPromise';



/*
  Generated class for the AllServicesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/


@Injectable()
export class AllServicesProvider {
  //  baseUrl: string = "https://ebuy.sundiatapost.com/api";
    baseUrl: string = "http://sideh/api";


    baseUrl2: string ="https://swapi.co/api";


  constructor(public http: HttpClient, public loadCtrl: LoadingController,
     public alertCtrl: AlertController,) {
    console.log('Hello AllServicesProvider Provider');
  }




  async gLocatorId(){
    return await new Promise((resolve, reject)=>{
      this.http.get(`${this.baseUrl}/generate-locator`)
      .pipe( retry(3) )
      .subscribe(data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    })
  }


  dummyReturn(){
    return this.http.get(`${this.baseUrl2}/people/1`);
  }


  // this returns the AIRTIME
 async airtimeReturn(phone, email, amount, network, pReference, gLocatorID){
    console.log('phone= ', phone);
    console.log('email= ', email);
    console.log('amount= ', amount);
    console.log('network= ', network);
    console.log('pReference= ', pReference);
    //let the user know whats going on
      this.loadCtrl.create({
        content: 'please wait while we process your transaction..',
        duration: 10000
      }).present();
    return await new Promise((resolve, reject)=>{
      console.log(`Base URL = ${this.baseUrl}`);

      this.http.post(`${this.baseUrl}/airtime/request`,
       {phone: phone,
         email: email,
          amount: amount,
           amount_paid:amount,
            network: network,
             pReference: pReference,
              gLocatorID: gLocatorID })
       .subscribe(data=>{
        console.log('success...');

        resolve(data);

        this.alertCtrl.create({
          title: 'Sundiata Message',
          message: 'Successful',
          buttons: ['OK']
        }).present();
      }, error =>{
        console.log("Errors...");

        reject(error);
        this.alertCtrl.create({
          title: 'Sundiata Message',
          message: 'Not Successful!, Please call 070-1319-1870',
          buttons: ['OK']
        }).present();
      });
    });
  }

  //POWER return get meter info

  async getMeterInfo(stateID, meterType, meterNo, amount, email, phone, gLocatorID, state, disco ){
     //let the user know whats going on
     this.loadCtrl.create({
      content: 'please wait while we verify your meter number..',
      duration: 8000
    }).present();
    return  await new Promise((resolve, reject)=>{
      this.http.post(`${this.baseUrl}/power/get-meter-info`,
    {
      stateID: stateID, meterType: meterType, meterNo: meterNo, amount: amount, email: email,
      phone: phone, gLocatorID: gLocatorID , state: state, disco: disco
    })
    .pipe( retry(3) )
    .subscribe(data=>{
      console.log('sucesss..');
      resolve(data);
      this.alertCtrl.create({
        title: 'Sundiata Message',
        message: 'Meter Number Verified!',
        buttons: ['OK']
      }).present();
    }, error =>{
      console.log('Errors....');
      reject(error);
      this.alertCtrl.create({
        title: 'Sundiata Message',
        message: 'Please put a VERIFIED METER NUMBER!',
        buttons: ['OK']
      }).present();
    });
  });
  }

  //POWER token transactionID
 async powerReturn(gLocatorID: string, pReference: any, amount_paid: number, token: number){
    console.log(gLocatorID);
    console.log(pReference);
    console.log(amount_paid);
    console.log(token);

    //let the user know whats going on
    this.loadCtrl.create({
      content: 'please wait while we process your transaction..',
      duration: 10000
    }).present();

    return await new Promise((resolve, reject)=>{
      this.http.post(this.baseUrl + '/power/request', {
        gLocatorID: gLocatorID, pReference: pReference, amount_paid: amount_paid, token: token
      }).subscribe(data =>{
        console.log('success..');
        resolve(data);
        this.alertCtrl.create({
          title: 'Sundiata Message',
          message: 'Successful',
          buttons: ['OK']
        }).present();
      }, error => {
        console.log('Errors...');
        reject(error);
        this.alertCtrl.create({
          title: 'Sundiata Message',
          message: 'Not Successful!',
          buttons: ['OK']
        }).present();
      });
    });
  }

 async getDataService() {
    return await new Promise((resolve, reject) => {
      this.http.get(`${this.baseUrl}/services/get-service/2`)
      .pipe( retry(3) )
      .subscribe(data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

 async getAirtimeService() {
 // let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return await new Promise((resolve, reject) => {
      this.http.get(`${this.baseUrl}/services/get-service/1`)
      .pipe( retry(3) )
      .subscribe(data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }

  async getTvService() {
    return await new Promise((resolve, reject) => {
      this.http.get(`${this.baseUrl}/services/get-service/4`)
      .pipe( retry(3) )
      .subscribe(data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });
  }


  // data bundles get
  async getDataBundles(networkID: number){
    console.log('network ID is:' + networkID);
    return await new Promise((resolve, reject)=>{
      this.http.get(this.baseUrl + '/data/bundles/' + networkID)
      .pipe( retry(3) )
      .subscribe(data=>{
        resolve(data);
      }, error=>{
        console.log(error);
      })
      ;
    })
  }


  // data bundle return
  async dataReturn(service_id, data_bundles_id, email, phone, amount, amount_paid, pReference, gLocatorID){

    //let the user know whats going on
    this.loadCtrl.create({
      content: 'please wait while we process your transaction..',
      duration: 10000
    }).present();

    return await new Promise((resolve, reject)=>{
      this.http.post(this.baseUrl + '/data/request' , {
        service_id: service_id, data_bundles_id: data_bundles_id, email: email, phone: phone,
        amount: amount, amount_paid: amount_paid, pReference: pReference, gLocatorID: gLocatorID
      }).subscribe(data=>{
        console.log('sucesss..');
        resolve(data);
        this.alertCtrl.create({
          title: 'Sundiata Message',
          message: 'Successful',
          buttons: ['OK']
        }).present();
      }, error =>{
        console.log('Errors...');
        reject(error);
        this.alertCtrl.create({
          title: 'Sundiata Message',
          message: 'Not Successful!',
          buttons: ['OK']
        }).present();
      });
    });
  }

  async tvReturn(gLocatorID, pReference, amount_paid, token){
    console.log(gLocatorID);
    console.log(pReference);
    console.log(amount_paid);
    console.log(token);
     //let the user know whats going on
     this.loadCtrl.create({
      content: 'please wait while we process your transaction..',
      duration: 10000
    }).present();
    return await new Promise((resolve, reject)=>{
      this.http.post(this.baseUrl + '/tv/request', {
        gLocatorID: gLocatorID ,pReference: pReference,amount_paid: amount_paid, token: token
      }).subscribe(data=>{
        console.log('success...');
        resolve(data);
        this.alertCtrl.create({
          title: 'Sundiata Message',
          message: 'Successful',
          buttons: ['OK']
        }).present();
      }, error =>{
        console.log('Errors..');
        reject(error);
        this.alertCtrl.create({
          title: 'Sundiata Message',
          message: 'Not Successful!, Please call 07014378159',
          // buttons: [
          //   {
          //     text: 'OK',

          //     handler: () =>{
          //       this.navCtrl.setRoot('MenuPage');
          //     }
          //   }
          // ]
          buttons:['OK']
        }).present();

      })
    })

  }


  // getStates(){
  //   return this.http.get('http://ebuy.sundiatapost.com/api/states');
  // }

  async getStates(){
    return await new Promise((resolve, reject)=>{
      this.http.get(`${this.baseUrl}/states`)
      .pipe( retry(3) )
      .subscribe(data=>{
        resolve(data);
      }, error=>{
        reject(error);
      })

    })
  }



  //get TV info
  async getTvInfo(providerID: number){
    console.log('Called to get provider services with TV ID:' + providerID);
    return await new Promise( (resolve, reject)=>{
      this.http.get(`${this.baseUrl}/tv/get-tv-info/${providerID}`)
      .pipe( retry(3) )
      .subscribe( data => {
        resolve(data);
      }, error => {
        reject(error);
      });
    });

  }

  // getCardInfo(providerID, card, amount, email, phone, gLocatorID, packagem, packageID, provider){
  //   console.log('TV Card ID is');
  //    return this.http.get(this.baseUrl +
  //      '/tv/get-card-info/?providerID='+providerID+'&card='+card
  //      +'&amount='+amount+'&email='+email+'&phone='+phone+'&gLocatorID='
  //      +gLocatorID+'&package='+packagem+'&packageID='+packageID+'&provider='+provider+'');
  // }

  // async getCardInfo(providerID, card, amount, email, phone, gLocatorID, packagem, packageID, provider){
  //    //let the user know whats going on
  //    this.loadCtrl.create({
  //     content: 'please wait while we verify your card details..',
  //     duration: 8000
  //   }).present();
  //   return await new Promise((resolve, reject)=>{
  //     this.http.get(this.baseUrl + '/tv/get-card-info/?providerID='+providerID+'&card='+card
  //     +'&amount='+amount+'&email='+email+'&phone='+phone+'&gLocatorID='
  //     +gLocatorID+'&package='+packagem+'&packageID='+packageID+'&provider='+provider+'')
  //     .subscribe(data=>{
  //       resolve(data);
  //       console.log('success...')
  //       this.alertCtrl.create({
  //         title: 'Sundiata Message',
  //         message: 'Card Details Verified!',
  //         buttons: ['OK']
  //       }).present();
  //     }, error=>{
  //       reject(error);
  //       console.log('errors...')
  //       this.alertCtrl.create({
  //         title: 'Sundiata Message',
  //         message: 'Please put a VALID SMARTCARD NUMBER!',
  //         buttons: ['OK']
  //       }).present();
  //     });
  //   })
  // }

  async getCardInfo(providerID, card, amount, email, phone, gLocatorID, packagem, packageID, provider){
    //let the user know whats going on
    this.loadCtrl.create({
      content: 'please wait while we verify your card details..',
      duration: 8000
    }).present();
    return await new Promise((resolve, reject)=>{
      this.http.post(`${this.baseUrl}/tv/get-card-info`, {
        providerID: providerID, card: card, amount: amount,
        email: email, phone: phone, gLocatorID: gLocatorID,
        package: packagem, packageID: packageID, provider: provider
      })
      .pipe( retry(3) )
      .subscribe(data=>{
        resolve(data);
        console.log('success...')
        this.alertCtrl.create({
          title: 'Sundiata Message',
          message: 'Card Details Verified!',
          buttons: ['OK']
        }).present();
      }, error=>{
        reject(error);
        console.log('errors...')
        this.alertCtrl.create({
          title: 'Sundiata Message',
          message: 'Please put a VALID SMARTCARD NUMBER!',
          buttons: ['OK']
        }).present();
      });

    })
  }







}
