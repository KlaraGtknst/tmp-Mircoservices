import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-store-tasks',
  templateUrl: './store-tasks.component.html',
  styleUrls: ['./store-tasks.component.scss']
})
export class StoreTasksComponent implements OnInit {

  constructor(private http: HttpClient) { }

  public palettes : any[] = [ ];

  storeTaskString = "Initiale Message";

  answer : any = {};

  async ngOnInit(){
    this.http.get<any>('http://localhost:3000/query/palettes')
      .subscribe(
        answer => this.handleQueryResponse(answer),
        error => this.storeTaskString = JSON.stringify(error, null, 3)
      );
  }

  handleQueryResponse(answer: any) {
    console.log('there is some data')
    for (const e of answer.result) {
      this.palettes.push(e.payload);
    }
    this.storeTaskString = `/query/palettes response contains ${this.palettes.length} palettes`
    console.log(this.storeTaskString)
  }

}
