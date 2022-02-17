import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'environments/environment';
import { ToastService } from 'ng-bootstrap-ext';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  public debugOut : String = 'Hello Order';

  public product = 'no product';

  public formGroup = new FormGroup({
    order: new FormControl('', [Validators.required]),
    product: new FormControl('', [Validators.required]),
    customer: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
  })

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.product = params['product']
      this.formGroup.get('order')?.setValue(uuidv4())
      this.formGroup.get('product')?.setValue(this.product)
    })
  }

  submitOffer() {
    this.debugOut = `Your name is ${this.formGroup.get('customer')?.value}`;
    const params = {
      order: this.formGroup.get('order')?.value,
      product: this.formGroup.get('product')?.value,
      customer: this.formGroup.get('customer')?.value,
      address: this.formGroup.get('address')?.value,
    }
    this.http.post<any>(environment.baseurl + 'cmd/placeOrder', params).subscribe( //http://localhost:3100/
      () => {
        this.toastService.success('Order', 'order submitted successfully !!!');
        this.router.navigate(['home', this.formGroup.get('customer')?.value]);
      },
      (error) => {
        this.toastService.error('Order not submitted', `Problem`, error);
      }
    )
  }

}
