import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationProvider } from '../notification/notification';
import { Observable } from 'rxjs';

/*
  Generated class for the ServicesDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServicesDataProvider {

  constructor(public http: HttpClient, private notification: NotificationProvider) {
  }

  VendDataSubscription(service_id, data_bundles_id, email, phone, amount, amount_paid, pReference, gLocatorID): Observable<HttpResponse<DataResp>> {
    return this.http.post<DataResp>(`${this.notification.API_URL}/data/request`, {
      service_id: service_id, data_bundles_id: data_bundles_id, email: email, phone: phone,
      amount: amount, amount_paid: amount_paid, pReference: pReference, gLocatorID: gLocatorID
    }, {
      observe: 'response'
    });
  }

}

export interface DataResp {
  msg: string;
  tNo: string;
  success: boolean;
}
