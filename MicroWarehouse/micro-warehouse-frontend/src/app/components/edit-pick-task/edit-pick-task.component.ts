import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
//import { ToastService } from 'ng-bootstrap-ext';
//import { ToastService } from 'ng-bootstrap-ext';

//URL: http://localhost:4200/pick-tasks/edit-offer
//http://localhost:4200/pick-tasks/pick-tasks/edit-offer/jeans
@Component({
  selector: 'app-edit-pick-task',
  templateUrl: './edit-pick-task.component.html',
  styleUrls: ['./edit-pick-task.component.scss']
})
export class EditPickTaskComponent implements OnInit {

  public product = 'no product';
  public productId = 'no product ID';
  public state = 'no state';
  public location: String[] = ['no location'];

  public formGroup = new FormGroup({
    product: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required, this.productLocationValidator()]),
  })

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    //private toastService: ToastService
  ) {

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productId = params['product']

      //console.log("edit pick tasks WH FE id params " + JSON.stringify(params, null, 3));

      this.http.get<any>(environment.baseurl + 'query/orders_' + this.productId) //http://localhost:3000/
              .subscribe(
                answer => {
                  //console.log("edit pick tasks WH FE location: " + JSON.stringify(answer, null, 3));
                  this.location = answer.location;
                  this.product = answer.product;
                  this.state = answer.state;
                  this.formGroup.get('product')?.setValue(this.product);
                },
                error => { console.log("Problem picking: location" + JSON.stringify(error, null, 3));}
      );
    })
  }

  productLocationValidator() {
    return (control: AbstractControl): ValidationErrors | null => {
      const forbidden = this.location.indexOf(control.value) < 0;
      return forbidden? {forbiddenName: {value: control.value}} : null;
    };
  }


  submitPick() {
    const params = {
      product: this.formGroup.get('product')?.value,
      location: this.formGroup.get('location')?.value,
      code: this.productId,
      state: this.state,
    }
    this.http.post<any>(environment.baseurl + 'cmd/pickDone', params).subscribe( //http://localhost:3000/
      () => {
        //this.toastService.success('PickOrder', 'Edit Pick submitted successfully !!!');
        //console.log("Successfull picking");
        this.router.navigate(['pick-tasks']);
      },
      (error) => {
        //this.toastService.error('Pick not submitted', `Problem`, error);
        console.log("Problem picking");
      }
    )
  }

}
