import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-store-tasks',
  templateUrl: './store-tasks.component.html',
  styleUrls: ['./store-tasks.component.scss']
})
export class StoreTasksComponent implements OnInit {

  constructor() { }
  public palettes = [
    {
      barcode: "b001",
      product: "red shoes",
      amount: 10,
      location: "shelf 42"
    },
    {
      barcode: "b002",
      product: "red shoes",
      amount: 10,
      location: "shelf 43"
    },
  ]

  storeTaskString = "Initiale Message"
  ngOnInit(): void {
  }

}
