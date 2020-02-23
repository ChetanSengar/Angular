import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { StartGameComponent } from './start-game/start-game.component';
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

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
