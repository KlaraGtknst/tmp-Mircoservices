import { HttpClient } from '@angular/common/http';
import { Component, OnInit, SystemJsNgModuleLoader } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-pick-task',
  templateUrl: './pick-task.component.html',
  styleUrls: ['./pick-task.component.scss']
})
export class PickTaskComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute) { }

  public pickTasks: any[] = [];
  public debugString : String = "Hello on pickTasks";

  ngOnInit(): void {
    //this.route.params.subscribe(params => {
      //cb values bleibt gleich

        this.http.get<any>(environment.baseurl + 'query/orders' )//http://localhost:3000/
          .subscribe(
            answer => this.handleQueryResponse(answer),
            error => this.debugString = JSON.stringify(error)
          );

    //})

    }

    handleQueryResponse(answer: any[]) {
      this.pickTasks = []
      const allKindOfOrders = document.querySelector('#accept:checked') !== null;
      console.log("Picktask WH FE: ", allKindOfOrders);
      for (const task of answer) {
        if(allKindOfOrders) {
          this.pickTasks.push(task);
        } else {
          if(task.state === "order placed") {
            this.pickTasks.push(task);
          }
        }

      }
      this.debugString = `number of offers ${this.pickTasks.length}`
      console.log(JSON.stringify(this.pickTasks, null, 3));
    }

  }
