import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPaletteComponent } from './components/add-palette/add-palette.component';
import { HomeComponent } from './components/home/home.component';
import { StoreTasksComponent } from './components/store-tasks/store-tasks.component';
import { PickTaskComponent } from './components/pick-task/pick-task.component';
import { EditPickTaskComponent } from './components/edit-pick-task/edit-pick-task.component';
import { DeliverOrderComponent } from './components/deliver-order/deliver-order.component';

const routes: Routes = [
  {path: 'home/:customer', component: HomeComponent},
  {path: 'home', component: HomeComponent},
  {path: 'store-tasks', component: StoreTasksComponent},
  {path: 'store-tasks/add-palette', component: AddPaletteComponent},
  {path: 'pick-tasks', component: PickTaskComponent},
  {path: 'pick-tasks/edit-offer', component: EditPickTaskComponent },
  {path: 'pick-tasks/edit-offer/:product', component: EditPickTaskComponent },
  {path: 'pick-tasks/pick-tasks/edit-offer/:product', component: EditPickTaskComponent }, //TODO: Why is my pickTasks doppelt?
  {path: '', component: HomeComponent},
  {path: 'deliver-orders', component: DeliverOrderComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
