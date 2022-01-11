import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.component.html',
  styleUrls: ['./edit-offer.component.scss']
})
export class EditOfferComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  validNames: string[] = ['jeans', 'tshirt'];

  formGroup = new FormGroup({
    productName: new FormControl('', [Validators.required, this.productNameValidator()]),
    productPrice: new FormControl('', [Validators.required, Validators.pattern("^[0-9]*(.[0-9]+)?[€$]?$"), this.productPriceValidator()]),
  });

  productNameValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = this.validNames.indexOf(control.value) < 0;
      return forbidden? {forbiddenName: {value: control.value}} : null;
    };
  }

  productPriceValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = control.value <= 0; //|| !(!isNaN(parseFloat(control.value)) && isFinite(control.value));
      return forbidden? {forbiddenName: {value: control.value}} : null;
    };
  }

  /*
  productNameError(control: AbstractControl) {
    const forbidden = this.validNames.indexOf(control.value) < 0;
      return forbidden? {forbiddenName: {value: control.value}} : null;
  }
  */

  debugOut = 'Hello edit offer'

  submitOffer() {
    this.debugOut = `Your input is ${this.formGroup.get('productName')?.value} with price: ${this.formGroup.get('productPrice')?.value}.`;
  }

}
