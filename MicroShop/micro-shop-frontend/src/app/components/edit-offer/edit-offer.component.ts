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
    productPrice: new FormControl('', [Validators.required, this.productPriceValidator()]),
  });

  productNameValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = this.validNames.indexOf(control.value) < 0;
      return forbidden? {forbiddenName: {value: control.value}} : null;
    };
  }

  productPriceValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = control.value <= 0;
      return forbidden? {forbiddenName: {value: control.value}} : null;
    };
  }

  //WIP
  productNameError(control: AbstractControl) {
    const forbidden = this.validNames.indexOf(control.value) < 0;
      return forbidden? {forbiddenName: {value: control.value}} : null;
  }
  //END WIP

  debugOut = 'Hello edit offer'

  submitOffer() {
    this.debugOut = `Your input is ${this.formGroup.get('productName')?.value} with price: ${this.formGroup.get('productPrice')?.value} `;
  }

}
