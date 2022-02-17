import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ProductDto } from 'common/ProductDto';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-offer-tasks',
  templateUrl: './offer-tasks.component.html',
  styleUrls: ['./offer-tasks.component.scss']
})
export class OfferTasksComponent implements OnInit {

  constructor(private http: HttpClient) { }

  public offers: ProductDto[] = [];

  storeTasksString = "Hello offer Tasks";

  ngOnInit(): void {

    /*this.offers.push({
      product: "jeans",
      state: "in stock",
      amount: 6,
      price: 0.0,
    });
    this.offers.push({
      product: "tshirt",
      state: "in stock",
      amount: 7,
      price: 0.0,
    });*/

    this.storeTasksString = `number of offers ${this.offers.length}`


    this.http.get<any>(environment.baseurl + 'query/products') //http://localhost:3100/
      .subscribe(
        answer => this.handleQueryResponse(answer),
        error => this.storeTasksString = JSON.stringify(error, null, 3)
      );

  }

  handleQueryResponse(answer: ProductDto[]) {
    this.offers = [];
    for (const product of answer) {
      //console.log(JSON.stringify(product, null, 3));
      this.offers.push(product);
    }
    this.storeTasksString = `number of offers ${this.offers.length}`;
  }


}
