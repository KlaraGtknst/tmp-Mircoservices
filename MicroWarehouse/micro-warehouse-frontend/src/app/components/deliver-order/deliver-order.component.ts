import { HttpClient } from '@angular/common/http';
import { Component, OnInit, SystemJsNgModuleLoader } from '@angular/core';
import { environment } from 'src/environments/environment.prod';

//http://localhost:4200/deliver-orders
@Component({
  selector: 'app-deliver-order',
  templateUrl: './deliver-order.component.html',
  styleUrls: ['./deliver-order.component.scss']
})
export class DeliverOrderComponent implements OnInit {

  constructor(
    private http: HttpClient) { }

  public deliverTasks: any[] = [];
  public debugString : String = "Hello on pickTasks";

  ngOnInit(): void {
      this.http.get<any>(environment.baseurl + 'query/deliveries' ) //http://localhost:3000/
        .subscribe(
          answer => {
            this.handleQueryResponse(answer);
          },
          error => this.debugString = JSON.stringify(error)
        );
    }

    handleQueryResponse(answer: any[]) {
      this.deliverTasks = [];
      for (const task of answer) {
          this.deliverTasks.push(task);
      }
      this.debugString = `number of offers ${this.deliverTasks.length}`
      console.log(JSON.stringify(this.deliverTasks, null, 3));
    }

    deliverOrder(deliverTask : any) {
      this.http.post<any>(environment.baseurl + 'cmd/deliverDone', deliverTask).subscribe( //http://localhost:3000/
      () => {
        console.log("Delivery Done (WH FW deliver-order Component): " + JSON.stringify(deliverTask, null, 3));
        window.location.reload();
      },
      (error) => {
        console.log("Delivery Problem (WH FW deliver-order Component): " + JSON.stringify(error, null, 3));
      }
    );
    }

  }
