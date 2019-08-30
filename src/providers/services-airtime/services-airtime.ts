import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NotificationProvider } from '../notification/notification';

/*
  Generated class for the ServicesAirtimeProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class ServicesAirtimeProvider {

  constructor(
    public http: HttpClient,
    public notification: NotificationProvider) {
  }

  RequestAirtime(phone, email, amount, network, pReference, gLocatorID): Observable<HttpResponse<AirtimeResp>> {
    return this.http.post<AirtimeResp>(`${this.notification.API_URL}/airtime/request`, {
      phone: phone,
      email: email,
      amount: amount,
      amount_paid:amount,
      network: network,
      pReference: pReference,
      gLocatorID: gLocatorID
    }, {
      observe: 'response'
    });
  }

}

export interface AirtimeResp {
  msg: string;
  tNo: number;
  success: boolean;
}
