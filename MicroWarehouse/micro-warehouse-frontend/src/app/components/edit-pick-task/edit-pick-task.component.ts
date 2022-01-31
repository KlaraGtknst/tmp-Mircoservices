import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'ng-bootstrap-ext';
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
  public location: String[] = [];

  public formGroup = new FormGroup({
    product: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
  })

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.product = params['product']
      //this.location = params['location']
      this.formGroup.get('product')?.setValue(params.product)
      //TODO: geht nicht, location undefined, s. browser console
      this.location = params.location;
      console.log("edit pick tasks WH FE location: " + JSON.stringify(params, null, 3));
      this.formGroup.get('location')?.setValue(params.location)
    })
  }

  submitPick() {
    const params = {
      product: this.formGroup.get('product')?.value,
      location: this.formGroup.get('location')?.value,
    }
    this.http.post<any>('http://localhost:3000/cmd/pickDone', params).subscribe(
      () => {
        this.toastService.success('PickOrder', 'Edit Pick submitted successfully !!!');
        console.log("Successfull picking");
        this.router.navigate(['pick-tasks']);
      },
      (error) => {
        this.toastService.error('Pick not submitted', `Problem`, error);
        console.log("Problem picking");
      }
    )
  }

}
