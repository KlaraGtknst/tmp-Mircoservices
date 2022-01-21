import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductDto } from 'common/ProductDto';
import { ToastService } from 'ng-bootstrap-ext';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.component.html',
  styleUrls: ['./edit-offer.component.scss']
})
export class EditOfferComponent implements OnInit {

  constructor(private http: HttpClient,
    private toastService: ToastService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.http.get<any>('http://localhost:3100/query/products')
    .subscribe(
      answer => this.handleQueryResponse(answer),
      error => this.debugOut = JSON.stringify(error, null, 3)
    );
  }

  handleQueryResponse(answer: ProductDto[]) {
    this.validNames= [];
    for (const elem of answer) {
      this.validNames.push(elem.product);
    }
    this.debugOut = `valid names: ${this.validNames}`
  }

  //Platzhalter, wird handleQueryResponse(.) hinzugefügt
  validNames: string[] = ['jeans', 'tshirt'];

  formGroup = new FormGroup({
    productName: new FormControl('', [Validators.required, this.productNameValidator()]),
    //remove €$ from RegEx
    productPrice: new FormControl('', [Validators.required/*, Validators.pattern("^[0-9]+(,[0-9][0-9]?)?[€$]?$")*/, this.productPriceValidator()]),
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

  /*
  productNameError(control: AbstractControl) {
    const forbidden = this.validNames.indexOf(control.value) < 0;
      return forbidden? {forbiddenName: {value: control.value}} : null;
  }
  */

  debugOut = 'Hello edit offer'

  submitOffer() {
    this.debugOut = `Your input is ${this.formGroup.get('productName')?.value} and its price is ${this.formGroup.get('productPrice')?.value}`;
    console.log(this.debugOut);
    const params = {
      product: this.formGroup.get('productName')?.value,
      price: Number(this.formGroup.get('productPrice')?.value),
    }
    console.log(this.debugOut);
    this.http.post<any>('http://localhost:3100/cmd/setPrice', params).subscribe(
      () => {
        this.toastService.success('Edit Offer', 'Price has been stored successfully !!!');
        this.router.navigate(['offer-tasks']);
      },
      (error) => {
        //this.toastService.error('Edit offer', `Problem: ${JSON.stringify(error, null, 3)}`);
        this.toastService.error('Edit offer', `Problem`, error);
      }
    );
  }



}
