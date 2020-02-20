import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ModalModule } from 'ngx-bootstrap';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,ModalModule.forRoot()


  ],
  providers: [BsModalService],
  bootstrap: [AppComponent]
})
export class AppModule { }