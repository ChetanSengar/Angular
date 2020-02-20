import { Component, OnInit, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ResponseListModel } from './responseList.model';
//import { IfStmt } from '@angular/compiler';
//import Swal from 'sweetalert2';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

import { BsModalService } from 'ngx-bootstrap/modal';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [BsModalService]
})
export class AppComponent implements OnInit {
  title = 'IES';
  modalRef: BsModalRef;

  answerHint: Array<any>;
  arrayList: Array<ResponseListModel>;
  answerListArray: Array<ResponseListModel>;
  constructor(private httpRef: HttpClient, public modalService: BsModalService) {


  }
  ngOnInit() {
    this.modalService.onHide.subscribe((e) => {
      console.log('close', this.modalService.config.initialState);
    });
    this.getData().subscribe(res => {
      console.log(res);
      this.arrayList = res[1].hidden_words_in_gird;
      this.arrayList.map((element, index) => {
        element.row.map((data, rowIndex) => {
          //  this.data={value:data,state:'nutral'};
          this.arrayList[index].row[rowIndex] = { value: data, state: 'nutral' };

        });
      });
      this.answerListArray = res[0].gird_with_answers;
      this.answerHint = [];
      for (let property in res[1].words_with_clue) {

        this.answerHint.push({ key: property, values: res[1].words_with_clue[property] });
      }
      console.log(this.answerHint);
    });
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
    let response1 = this.httpRef.get('../assets/finalBackEnd/gird_with_answers.json');
    let response2 = this.httpRef.get('../assets/finalBackEnd/hidden_words_in_gird.json');

    return  forkJoin([response1, response2]);

  }
  showAnswer(rowIndex, template) {
    this.openModal(template, this.answerHint[rowIndex].key);

  }
  keyUp(event, rowIndex, keyIndex) {

    console.log(rowIndex);
    let enterKey: string = event.target.value;
    let toLowerCaseKey = enterKey.toUpperCase();

    if (event.target.value === '') {
      this.arrayList[rowIndex].row[keyIndex].state = 'nutral';
    }

    else {
      if ((this.answerListArray[rowIndex].row[keyIndex] == toLowerCaseKey)) {
        this.arrayList[rowIndex].row[keyIndex].state = 'present';
      }
      else {
        this.arrayList[rowIndex].row[keyIndex].state = "not_present";
      }
    }
  }
}
