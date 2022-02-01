import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeModule } from './components/home/home.module';
import { StoreTasksModule } from './components/store-tasks/store-tasks.module';
import { AddPaletteComponent } from './components/add-palette/add-palette.component';
import { AddPaletteModule } from './components/add-palette/add-palette.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PickTaskComponent } from './components/pick-task/pick-task.component';
import { PickTaskModule } from './components/pick-task/pick-task.module';
import { EditPickTaskComponent } from './components/edit-pick-task/edit-pick-task.component';
import { EditPickTaskModule } from './components/edit-pick-task/edit-pick-task.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DeliverOrderComponent } from './components/deliver-order/deliver-order.component';
import { DeliverOrderModule } from './components/deliver-order/deliver-order.module';
//import { ToastModule } from 'ng-bootstrap-ext';

@NgModule({
  declarations: [
    AppComponent,
    AddPaletteComponent,
    PickTaskComponent,
    EditPickTaskComponent,
    DeliverOrderComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HomeModule,
    StoreTasksModule,
    AddPaletteModule,
    HttpClientModule,
    PickTaskModule,
    EditPickTaskModule,
    ReactiveFormsModule,
    DeliverOrderModule,
    //ToastModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
