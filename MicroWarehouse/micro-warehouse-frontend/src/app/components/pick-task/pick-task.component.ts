import { HttpClient } from '@angular/common/http';
import { Component, OnInit, SystemJsNgModuleLoader } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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

        this.http.get<any>('http://localhost:3000/query/orders' )//has no location at Shop, look at warehouse palettes
          .subscribe(
            answer => this.handleQueryResponse(answer),
            error => this.debugString = JSON.stringify(error)
          );

    //})
    }

    handleQueryResponse(answer: any[]) {
      this.pickTasks = [];
      for (const task of answer) {
          this.pickTasks.push(task);
      }
      this.debugString = `number of offers ${this.pickTasks.length}`
      console.log(JSON.stringify(this.pickTasks, null, 3));
    }

  }
