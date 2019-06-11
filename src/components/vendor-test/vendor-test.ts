import { Component } from '@angular/core';

/**
 * Generated class for the VendorTestComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'vendor-test',
  templateUrl: 'vendor-test.html'
})
export class VendorTestComponent {

  text: string;

  constructor() {
    console.log('Hello VendorTestComponent Component');
    this.text = 'Hello World';
  }

}
