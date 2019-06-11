import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the VendorStructuresProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class VendorStructuresProvider {

  constructor(public http: HttpClient) {
    console.log('Hello VendorStructuresProvider Provider');
  }

}

export interface VendorSignup {
  success: boolean;
  status: number;
  message: any;
  token: string;
  validation: boolean;
  account: any;
}

export interface VendorLogin {
  status: boolean;
  token: string;
  account: any;
}

export interface VendorProfile {
  status: boolean;
  message: string;
  profile: any;
}

export interface VendorProfileUpdate {
  status: boolean;
  validation: boolean;
  message: any;
}

export interface VendorTransactions {
  status: boolean;
  total: number;
  transactions: any;
}

export interface AirtimeTransactionRequest {
  status: number;
  ref: string;
  msg: any;
  validation: boolean;
  success: boolean;
}

export interface PowerTransactionRequest {
  status: number;
  ref: string;
  msg: any;
  validation: boolean;
  success: boolean;
  amount: number;
}

export interface PowerTransactionComplete {
  status: number;
  msg: any;
  success: boolean;
}

export interface DataTransactionRequest {
  status: number;
  ref: string;
  msg: any;
  validation: boolean;
  success: boolean;
}

export interface TvTransactionRequest {
  status: number;
  ref: string;
  msg: any;
  amount: number;
  success: boolean;
  validation: boolean;
}

export interface TvTransactionComplete {
  status: number;
  msg: any;
  success: boolean;
}
