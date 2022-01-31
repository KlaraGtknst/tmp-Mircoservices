import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute) { }

  public customer = "";
  public offers: any[] = [];
  public orders: any[] = [];
  public debugString : String = "Hello on sale page";

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if(params['customer']) {
        this.customer = params['customer']
        this.http.get<any>('http://localhost:3100/query/orders_' + this.customer)
          .subscribe(
            answer => this.handleOrderList(answer),
            error => this.debugString = JSON.stringify(error)
          );
      }
    })

    this.http.get<any>('http://localhost:3100/query/products')
    .subscribe(
      answer => this.handleQueryResponse(answer),
      error => this.debugString = JSON.stringify(error, null, 3)
    );
  }

  handleQueryResponse(answer: any[]) {
    console.log("Shop FE homecomponent handleQueryResp:" + JSON.stringify(answer, null, 3));
    this.offers = [];
    for (const product of answer) {
      if (product.price > 0) {
        this.offers.push(product);
      }
    }
    this.debugString = `number of offers ${this.offers.length}`
  }

  handleOrderList(answer: any[]) {
    this.orders = answer;
    this.customer = `${this.customer}, you have ${this.orders.length} active order(s).`
  }

}
