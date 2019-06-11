import { AirtimeTransactionRequest, PowerTransactionRequest, PowerTransactionComplete, DataTransactionRequest, VendorSignup, VendorLogin, VendorProfile, VendorProfileUpdate, VendorTransactions, TvTransactionRequest, TvTransactionComplete } from './../vendor-structures/vendor-structures';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationProvider } from '../notification/notification';
import { Observable } from 'rxjs';

/*
  Generated class for the VendorProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class VendorProvider {

  constructor(public http: HttpClient, private notification: NotificationProvider) {
    console.log('Hello VendorProvider Provider');
  }

  private headers() {
    const token = localStorage.getItem('vendorToken');
    return token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : null;
  }

  public RegisterVendor(
    fname: string, lname: string, email: string, phone: string,
    password: string, password_confirmation: string, promote: boolean): Observable<HttpResponse<VendorSignup>> {
      return this.http.post<VendorSignup>(`${this.notification.TEST_SERVER_URL}/vendors/submit-request`, {
        fname, lname, email, phone, password, password_confirmation, promote
      }, {
        observe: 'response'
      });
  }

  public LoginVendor(email: string, password: string): Observable<HttpResponse<VendorLogin>> {
    return this.http.post<VendorLogin>(`${this.notification.TEST_SERVER_URL}/vendors/login`, {
      email, password
    }, {
      observe: 'response'
    });
  }

  public GetVendorProfile(): Observable<HttpResponse<VendorProfile>> {
    return this.http.get<VendorProfile>(`${this.notification.TEST_SERVER_URL}/vendors/profile`, {
      observe: 'response', headers: this.headers()
    });
  }

  public UpdateVendorProfile(
    business_name: string, address: string, city: string,
    state_id: number, alt_phone: string, website: string,
    office_phone: string, office_email: string
  ): Observable<HttpResponse<VendorProfileUpdate>> {
    return this.http.post<VendorProfileUpdate>(`${this.notification.TEST_SERVER_URL}/vendors/profile`, {
      business_name, address, city, state_id, alt_phone, website, office_phone, office_email
    }, {
      observe: 'response', headers: this.headers()
    });
  }

  public RegisterAirtimeTransaction(phone: string, network: number, email: string, amount: number): Observable<HttpResponse<AirtimeTransactionRequest>> {
    return this.http.post<AirtimeTransactionRequest>(`${this.notification.TEST_SERVER_URL}/vendors/transactions/airtime/register`, {
      phone, network, email, amount
    }, {
      observe: 'response', headers: this.headers()
    });
  }

  public RegisterPowerTransaction(
    stateID: number, meterType: number, meterNo: number,
    amount: number, email: string, phone: string, state: string, disco: string): Observable<HttpResponse<PowerTransactionRequest>> {
      return this.http.post<PowerTransactionRequest>(`${this.notification.TEST_SERVER_URL}/vendors/transactions/power/register`, {
        stateID, meterType, meterNo, amount, email, phone, state, disco
      }, {
        observe: 'response', headers: this.headers()
      });
  }

  public RegisterPowerTransactionComplete(transaction: string): Observable<HttpResponse<PowerTransactionComplete>> {
    return this.http.post<PowerTransactionComplete>(`${this.notification.TEST_SERVER_URL}/vendors/transactions/power/complete`, {
      transaction
    }, {
      observe: 'response', headers: this.headers()
    });
  }

  public RegisterDataTransaction(service: number, bundle: number, phone: string, email: string): Observable<HttpResponse<DataTransactionRequest>> {
    return this.http.post<DataTransactionRequest>(`${this.notification.TEST_SERVER_URL}/vendors/transactions/data/register`, {
      service, bundle, phone, email
    }, {
      observe: 'response', headers: this.headers()
    });
  }

  public RegisterTvTransaction(packageText: string, packageID: number, provider: string, providerID: number, card: number, amount: number, email: number, phone: string): Observable<HttpResponse<TvTransactionRequest>> {
    return this.http.post<TvTransactionRequest>(`${this.notification.TEST_SERVER_URL}/vendors/transactions/tv/register`, {
      package: packageText,
      packageID: packageID,
      provider: provider,
      providerID: providerID,
      card: card,
      amount: amount,
      email: email,
      phone: phone
    }, {
      observe: 'response', headers: this.headers()
    });
  }

  public RegisterTvTransactionComplete(transaction: string): Observable<HttpResponse<TvTransactionComplete>> {
    return this.http.post<TvTransactionComplete>(`${this.notification.TEST_SERVER_URL}/vendors/transactions/tv/complete`, {
      transaction
    }, {
      observe: 'response', headers: this.headers()
    });
  }

  public GetPowerTransactionHistory(total: number, status: any): Observable<HttpResponse<VendorTransactions>> {
    return this.http.get<VendorTransactions>(`${this.notification.TEST_SERVER_URL}/vendors/transactions/power/${status}`, {
      observe: 'response', headers: this.headers()
    });
  }

  public GetAirtimeTransactionHistory(total: number, status: any): Observable<HttpResponse<VendorTransactions>> {
    return this.http.get<VendorTransactions>(`${this.notification.TEST_SERVER_URL}/vendors/transactions/airtime/${status}`, {
      observe: 'response', headers: this.headers()
    });
  }

  public GetDataTransactionHistory(total: number, status: any): Observable<HttpResponse<VendorTransactions>> {
    return this.http.get<VendorTransactions>(`${this.notification.TEST_SERVER_URL}/vendors/transactions/data/${status}`, {
      observe: 'response', headers: this.headers()
    });
  }

  public GetTvTransactionHistory(total: number, status: any): Observable<HttpResponse<VendorTransactions>> {
    return this.http.get<VendorTransactions>(`${this.notification.TEST_SERVER_URL}/vendors/transactions/tv/${status}`, {
      observe: 'response', headers: this.headers()
    });
  }
}

