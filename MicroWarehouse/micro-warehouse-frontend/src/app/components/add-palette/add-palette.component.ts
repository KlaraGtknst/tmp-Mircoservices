import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router'


@Component({
  selector: 'app-add-palette',
  templateUrl: './add-palette.component.html',
  styleUrls: ['./add-palette.component.scss']
})
export class AddPaletteComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router) { }

  barcode = ''
  product = ''
  amount = ''
  location = ''

  ngOnInit(): void {
  }

  async addPalette() {

    const newPalette = {
      barcode: this.barcode,
      product: this.product,
      amount: this.amount,
      location: this.location
    }

    const newCmd = {
      opCode: 'storePalette',
      parameters: newPalette,
    }

    try {
      this.http.post<any>('http://localhost:3000/cmd', newCmd).subscribe(
        () => {this.router.navigate(['/store-tasks']);}
      )
      /*const response = await this.http.post<any>('http://localhost:3000/cmd', newCmd).toPromise();
      console.log(`post has been send ${JSON.stringify(response, null, 3)}`);
      this.router.navigate(['/store-tasks']);*/
    } catch(error) {
      console.log('post error');
    }

  }

}
