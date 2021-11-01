import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPaletteComponent } from './components/add-palette/add-palette.component';
import { HomeComponent } from './components/home/home.component';
import { StoreTasksComponent } from './components/store-tasks/store-tasks.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'store-tasks', component: StoreTasksComponent},
  {path: 'store-tasks/add-palette', component: AddPaletteComponent},
  {path: '', component: HomeComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
