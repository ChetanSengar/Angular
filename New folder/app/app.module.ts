import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ModalModule } from 'ngx-bootstrap';
import { FirstPageComponent } from './first-page/first-page.component';
import { StartGameComponent } from './start-game/start-game.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    FirstPageComponent,
    StartGameComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,ModalModule.forRoot(),
    FormsModule


  ],
  providers: [BsModalService],
  bootstrap: [StartGameComponent],
  entryComponents:[StartGameComponent]
})
export class AppModule { }
