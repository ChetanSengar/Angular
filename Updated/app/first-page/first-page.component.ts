import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import test from '../../assets/finalBackEnd/across_down.json';
import { Router } from '@angular/router';

@Component({
  selector: 'app-first-Page',
  templateUrl: './first-page.component.html',
  styleUrls: ['./first-page.component.scss']
})
export class FirstPageComponent implements OnInit {
  modelData: GridDataModel = new GridDataModel();
  gridType = [9, 12, 15];
  metricType = ["Full", "Central", "Diagonal", "Asymmetry", "Horizontal", "Vertical"];
  themeType = ["Science", "Biology", "Random"];
  //  data:number;
  constructor(private httpClient: HttpClient, private route: Router) {
  }

  ngOnInit(): void {
    // console.log(test);
  }
  setInputValue(event: any) {
    this.data = event.target.value;
  }

  saveInput() {
    this.modelData.grid=parseInt(this.modelData.grid);
    if (this.modelData.grid && this.modelData.sym_type && this.modelData.theme_type) {
      this.httpClient.post('http://localhost:3000/posts',this.modelData).subscribe(el=>{
        console.log('asdsad',this.modelData);
        this.route.navigate(['game-start']);
      });
    }
  }
  gridTypefunc(event, key) {
    if (key === "number") {
      this.modelData.grid = event.target.value;
    } else if (key === "metrictype") {
      this.modelData.sym_type = event.target.value;
    } else {
      this.modelData.theme_type = event.target.value;
    }
  }

}
export class GridDataModel {
  grid: number;
  sym_type: string;
  theme_type: string;
}
