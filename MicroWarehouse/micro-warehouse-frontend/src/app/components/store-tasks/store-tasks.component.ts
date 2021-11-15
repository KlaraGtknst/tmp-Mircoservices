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

  response : any = {};

  async ngOnInit() {
    this.response = await this.http
      .get<any>('http://localhost:3000/query/palettes')
      .toPromise();
    console.log('there is some data')
    for (const event of this.response.result) {
      this.palettes.push(event.payload);
    }
    //this.storeTaskString = JSON.stringify(this.response, null, 3)
    console.log(this.storeTaskString)
  }

}
