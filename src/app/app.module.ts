import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpClientModule } from '@angular/common/http';

import { MyApp } from './app.component';
import { Angular4PaystackModule } from 'angular4-paystack';
import { AllServicesProvider } from '../providers/all-services/all-services';
import { IonicStorageModule } from '@ionic/storage';
import { AngularRaveModule } from 'angular-rave';

@NgModule({
  declarations: [
    MyApp,


  ],
  imports: [
    Angular4PaystackModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpClientModule,
    AngularRaveModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,


  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AllServicesProvider
  ]
})
export class AppModule {}
