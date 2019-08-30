import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationProvider } from '../notification/notification';
import { Observable } from 'rxjs';

/*
  Generated class for the ServicesPowerProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServicesPowerProvider {

  constructor(public http: HttpClient, private notification: NotificationProvider) {

  }

  VerifyMeter(stateID, meterType, meterNo, amount, email, phone, gLocatorID, state, disco): Observable<HttpResponse<MeterInfoResp>> {
    return this.http.post<MeterInfoResp>(`${this.notification.API_URL}/power/get-meter-info`, {
      stateID: stateID,
      meterType: meterType,
      meterNo: meterNo,
      amount: amount,
      email: email,
      phone: phone,
      gLocatorID: gLocatorID ,
      state: state,
      disco: disco
    }, {
      observe: 'response'
    });
  }

  VendPower(gLocatorID, pReference, amount_paid, token): Observable<HttpResponse<PowerReturnResp>> {
    return this.http.post<PowerReturnResp>(`${this.notification.API_URL}/power/request`, {
      gLocatorID: gLocatorID, pReference: pReference, amount_paid: amount_paid, token: token
    }, { observe: 'response' });
  }

}


export interface MeterInfoResp {
  status: boolean;
  msg: string;
  token: number;
  serviceProvider: string;
  amount: number;
}

export interface PowerReturnResp {
  status: number;
  msg: string;
  success: false;
}
