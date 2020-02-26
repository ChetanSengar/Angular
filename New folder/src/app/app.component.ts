import { Component, OnInit, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseListModel } from './responseList.model';
import { BsModalRef } from 'ngx-bootstrap';
import { BsModalService } from 'ngx-bootstrap';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import  Swal  from 'sweetalert2';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [BsModalService]
})

export class AppComponent implements OnInit {
  gridType = [9, 10, 11, 12, 13, 14, 15];
  allAnswerIndex:number=0;
  metricType = ['full_symmetry', 'central_symmetry', 'diagonal', 'horizontal_symmetry', 'vertical_symmetry'];
  modelData: GridDataModel = new GridDataModel();
  title = 'IES';
  testString: string = '';
  modalRef: BsModalRef;
  stringTestArray = [];
  answerModel: [];
  totalIndex:number=0;
  showAns: boolean = false;
  answerHintacross = [];
  answerHintdown = [];
  answerHint =[];
  arrayList: Array<ResponseListModel>;
  answerListArray: Array<ResponseListModel>;
  data: any;

  constructor(private httpRef: HttpClient, private httpClient: HttpClient, public modalService: BsModalService, private router: Router) {
  }

  ngOnInit() {
    this.modalService.onHide.subscribe((e) => {
      console.log('close', this.modalService.config.initialState);
    });
    this.getData().subscribe(res => {

      console.log(res);
      this.arrayList = res[0].hidden_words_in_gird;
      this.arrayList.map((element, index) => {
        element.row.map((data, rowIndex) => {
          //this.data={value:data,state:'nutral'};
          this.arrayList[index].row[rowIndex] = { value: data, state: 'nutral',placeHolder:0 };

        });
      });
      this.answerHintdown=[];
      this.answerHintacross=[];
      this.answerListArray = res[0].hidden_words_in_gird;
      this.answerHint = [];
      this.answerModel = res[1]['Across Words'].name;
       for (let property of res[1]['Across Words'].name) {
        this.totalIndex +=1;
        this.allAnswerIndex +=1;
        this.answerHintacross.push({ key: property.name, values: property.hint, count:property.name.length,row:property.row,col:property.col,index:this.allAnswerIndex });
      }

      for (let property of res[1]['Down Words'].name) {
       this.allAnswerIndex +=1;
        this.answerHintdown.push({ key: property.name, values: property.hint, count:property.name.length, row:property.row,col:property.col,index:this.allAnswerIndex });
      }
      this.getHintsOnBoard(this.answerHintacross,this.answerHintdown);


    });

   }
  getHintsOnBoard(acrossList,downList)
  {
      for(let i=0;i<acrossList.length;i++)
      {
          this.showAnswer(acrossList[i],i+1);
      }
      for(let i=0;i<downList.length;i++)
      {
        this.totalIndex +=1;
          this.showAnswer(downList[i],this.totalIndex);
      }
  }
  //For Nav.
  setInputValue(event: any) {
    this.data = event.target.value;
  }
  saveInput() {
    this.modelData.stateType = '1';
    this.modelData.grid = parseInt(this.modelData.grid);
    if (this.modelData.grid && this.modelData.sym_type && this.modelData.stateType) {
      this.httpClient.post('http://localhost:3000/posts', this.modelData).subscribe(el => {
        console.log('asdsad', this.modelData);
        //this.route.navigate(['game-start']);
      });
    }
  }
  gridTypefunc(event, key) {
    if (key === 'number') {
      this.modelData.grid = event.target.value;
    } else if (key === 'metrictype') {
      this.modelData.sym_type = event.target.value;
    } else {
      this.modelData.stateType = event.target.value;
    }
  }
  //End of Nav.

  openModal(template: TemplateRef<any>, data) {

    this.modalRef = this.modalService.show(template, {
      initialState: data
    });
    setTimeout(() => {
      this.modalRef.hide();

    }, 1000);
  }
  getData(): Observable<any> {

    let response2 = this.httpRef.get('../assets/finalBackEnd/hidden_words_in_gird.json');
    let response = this.httpRef.get('../assets/finalBackEnd/across_down_words_table.json');
    return forkJoin([response2, response]);

  }

  // showAnswer(rowIndex, template) {
  //   this.openModal(template, this.answerHint[rowIndex].key);

  // }
    showAnswer(data, lineNumber) {
       this.arrayList[data.row].row[data.col].placeHolder=lineNumber;
      console.log('new array list is',this.arrayList);
    // this.openModal(template, this.answerHint[rowIndex].key);



  }

  getAppendString() {
    this.testString = '';
    this.stringTestArray.map(el => {
      this.testString = this.testString.concat(el.key).toUpperCase();
    });

    return this.testString;
  }
  checkString(key, row, col) {

    let findData = this.stringTestArray.findIndex(el => el.row === row && el.col === col);
    let obj = { key: key, row: row, col: col };
    if (findData != -1) {

      this.stringTestArray[findData] = obj;
    }
    else {
      this.stringTestArray.push(obj);
    }
    console.log("find data", findData);
  }

  //mine.
  navigateBack() {
    this.router.navigate(['']);
  }
  checkWonStatus(key)
  {
    debugger
   let findKey= this.answerHintacross.find(el=>el.key===key);
   if(!!findKey)
   {
    Swal.fire({

      icon: 'success',
      title: 'Sentence Completed !'
      })
   }
   else
   {
    let SeconddKey= this.answerHintdown.find(el=>el.key===key);
    if(!!SeconddKey)
    {
      Swal.fire({

        icon: 'success',
        title: 'Sentence Completed !'
        })
    }

   }

  }
  keyUp(event, rowIndex, keyIndex) {
    console.log(rowIndex);
    let enterKey: string = event.target.value;
    let toLowerCaseKey = enterKey.toUpperCase();

    this.checkString(toLowerCaseKey, rowIndex, keyIndex);
    this.testString = this.getAppendString();
    console.log("appned string is",this.testString);
    this.checkWonStatus(this.testString);
    this.answerModel.map(element => {
      if (element.name.charAt(0) === toLowerCaseKey && element.row === rowIndex && element.col === keyIndex) {
        this.arrayList[rowIndex].row[keyIndex].state = 'nutral';

      } else if (this.testString.length > 1 && element.name.includes(this.testString)) {
        this.arrayList[rowIndex].row[keyIndex].state = 'nutral';
        if (this.testString === element.name) {
          // alert('Congrats ! One Sentence completed.');
        }
      } else if (this.testString.length > 1 && !element.name.includes(this.testString)) {
        this.arrayList[rowIndex].row[keyIndex].state = 'nutral';
      }

    });
  }
  showGridAns() {
    console.log('Hello World !!');
    this.showAns = true;
  }
  hideGridAns() {
    this.showAns = false;
  }
}
export class GridDataModel {
  grid: number;
  sym_type: string;
  // theme_type: string;
  stateType: string;
}