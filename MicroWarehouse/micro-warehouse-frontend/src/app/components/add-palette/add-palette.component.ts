import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-palette',
  templateUrl: './add-palette.component.html',
  styleUrls: ['./add-palette.component.scss']
})
export class AddPaletteComponent implements OnInit {

  constructor() { }

  barcode = ''
  product = ''
  amount = ''
  location = ''  

  ngOnInit(): void {
  }

  addPalette() {

    const newPalette = {
      barcode: this.barcode,
      product: this.product,
      amount: this.amount,
      location: this.location
    }

    console.log(JSON.stringify(newPalette, null, 3))

  }
  
}
