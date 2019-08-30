import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the PaginationProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PaginationProvider {

  collections: any;
  pageIndex: number;
  itemsPerPage: number;
  constructor(public http: HttpClient) {
    console.log('Hello PaginationProvider Provider');
  }

  set Collections($collection) {
    this.collections = $collection;
  }

  set ItemsPerPage($total: number) {
    this.itemsPerPage = $total;
  }

  get Collections() {
    return this.collections;
  }

  get ItemsPerPage() {
    return this.itemsPerPage;
  }

  // returns number of items within the entire collection
  get ItemCount() {
    return this.Collections.length;
  }

  // returns the number of pages
  get PageCount() {
    return Math.ceil(this.Collections.length / this.ItemsPerPage);
  }

  set PageIndex($index: number) {
    this.pageIndex = $index;
  }

  get PageIndex() {
    return this.pageIndex;
  }

  // returns number of items on the current page
  PageItemCount($pageIndex: number) {
    const count = this.PageCount - 1;
    if ( $pageIndex > count || $pageIndex < 0 ) {
      return -1;
    }

    const num = ((($pageIndex + 1) * this.ItemsPerPage) % this.ItemCount % this.ItemsPerPage);
    return this.ItemsPerPage - Math.ceil(num);
  }

  // determines what page an item is on
  ItemIndex($itemIndex) {
    if ( $itemIndex > this.ItemCount - 1 || $itemIndex < 0) {
      return -1;
    }
    return Math.ceil( ($itemIndex + 1) / this.ItemsPerPage) - 1;
  }
}
