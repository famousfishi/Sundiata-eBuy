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
import { ServicesAirtimeProvider } from '../providers/services-airtime/services-airtime';
import { NotificationProvider } from '../providers/notification/notification';
import { ServicesPowerProvider } from '../providers/services-power/services-power';
import { ServicesTvProvider } from '../providers/services-tv/services-tv';
import { ServicesDataProvider } from '../providers/services-data/services-data';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Rave, Misc, RavePayment } from 'rave-ionic3';
import { VendorProvider } from '../providers/vendor/vendor';
import { VendorStructuresProvider } from '../providers/vendor-structures/vendor-structures';
import { PaginationProvider } from '../providers/pagination/pagination';

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
    AllServicesProvider,
    ServicesAirtimeProvider,
    NotificationProvider,
    ServicesPowerProvider,
    ServicesTvProvider,
    ServicesDataProvider,
    InAppBrowser,
    Rave,
    RavePayment,
    Misc,
    VendorProvider,
    VendorStructuresProvider,
    PaginationProvider,
    NotificationProvider
  ]
})
export class AppModule {}
