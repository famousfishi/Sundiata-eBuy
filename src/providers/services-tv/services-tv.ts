import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationProvider } from '../notification/notification';
import { Observable } from 'rxjs';

/*
  Generated class for the ServicesTvProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServicesTvProvider {

  constructor(public http: HttpClient, private notification: NotificationProvider) {
  }

  ConfirmSmartCard(providerID, card, amount, email, phone, gLocatorID, packagem, packageID, provider): Observable<HttpResponse<TvInfoResp>> {
    return this.http.post<TvInfoResp>(`${this.notification.API_URL}/tv/get-card-info`, {
      providerID: providerID, card: card, amount: amount,
      email: email, phone: phone, gLocatorID: gLocatorID,
      package: packagem, packageID: packageID, provider: provider
    }, {
      observe: 'response'
    });
  }

  VendTvSubscription(gLocatorID, pReference, amount_paid, token): Observable<HttpResponse<TvInfoResp>> {
    return this.http.post<TvInfoResp>(`${this.notification.API_URL}/tv/request`, {
      gLocatorID: gLocatorID ,pReference: pReference,amount_paid: amount_paid, token: token
    }, {
      observe: 'response'
    });
  }

}

export interface TvInfoResp {
  status: number;
  msg: string;
  success: boolean;
}
