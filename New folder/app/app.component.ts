import { Component, OnInit, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResponseListModel } from './responseList.model';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [BsModalService]
})

export class AppComponent implements OnInit {
  title = 'IES';
  testString: string = '';
  modalRef: BsModalRef;
  stringTestArray = [];
  answerModel: [];
  showAns: boolean = false;
  answerHintacross = [];
  answerHintdown = [];
  arrayList: Array<ResponseListModel>;
  answerListArray: Array<ResponseListModel>;
  constructor(private httpRef: HttpClient, public modalService: BsModalService, private router: Router) {
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
          //  this.data={value:data,state:'nutral'};
          this.arrayList[index].row[rowIndex] = { value: data, state: 'nutral' };

        });
      });

      this.answerListArray = res[0].hidden_words_in_gird;
      this.answerHint = [];
      this.answerModel = res[1]['Across Words'].name;

      for (let property of res[1]['Across Words'].name) {
        this.answerHintacross.push({ key: property.name, values: property.hint });
      }

      for (let property of res[1]['Down Words'].name) {
        this.answerHintdown.push({ key: property.name, values: property.hint });
      }

    });
    console.log("cross word", this.answerHintacross, this.answerHintdown)
  }
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

  showAnswer(rowIndex, template) {
    this.openModal(template, this.answerHint[rowIndex].key);

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

  keyUp(event, rowIndex, keyIndex) {
    console.log(rowIndex);
    let enterKey: string = event.target.value;
    let toLowerCaseKey = enterKey.toUpperCase();

    this.checkString(toLowerCaseKey, rowIndex, keyIndex);
    this.testString = this.getAppendString();
    this.answerModel.map(element => {
      if (element.name.charAt(0) === toLowerCaseKey && element.row === rowIndex && element.col === keyIndex) {
        this.arrayList[rowIndex].row[keyIndex].state = 'present';

      }
      else if (this.testString.length > 1 && element.name.includes(this.testString)) {
        this.arrayList[rowIndex].row[keyIndex].state = 'present';
        if (this.testString === element.name) {
          alert('Congrats ! One Sentence completed.');
        }
      }
      else if (this.testString.length > 1 && !element.name.includes(this.testString)) {
        this.arrayList[rowIndex].row[keyIndex].state = 'not_present';
      }

    });
  }
  showGridAns() {
    console.log("Hello World !!");
    this.showAns = true;
  }
  hideGridAns() {
    this.showAns = false;
  }
}