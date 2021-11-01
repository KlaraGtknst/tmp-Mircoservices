import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeModule } from './components/home/home.module';
import { StoreTasksModule } from './components/store-tasks/store-tasks.module';
import { AddPaletteComponent } from './components/add-palette/add-palette.component';
import { AddPaletteModule } from './components/add-palette/add-palette.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    AddPaletteComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HomeModule,
    StoreTasksModule,
    AddPaletteModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
