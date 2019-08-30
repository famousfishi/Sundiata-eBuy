import { NgModule } from '@angular/core';
import { VendorTestComponent } from './vendor-test/vendor-test';
@NgModule({
	declarations: [VendorTestComponent,
    VendorTestComponent],
	imports: [],
	exports: [VendorTestComponent,
    VendorTestComponent]
})
export class ComponentsModule {}
