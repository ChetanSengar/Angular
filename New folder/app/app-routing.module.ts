import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { FirstPageComponent } from './first-page/first-page.component';


const routes: Routes = [
  {
    path: "",
    component: FirstPageComponent

  },
  {
    path: "game-start",
    component: AppComponent
  }
];

const routes2: Routes = [
  {
    path: "",
    component: AppComponent

  },
  {
    path: "back-main",
    component: FirstPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), RouterModule.forRoot(routes2)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
