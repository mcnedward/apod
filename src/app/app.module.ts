import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AngualertModule } from 'angualert';

import { AppComponent } from './app.component';
import { ApodComponent } from './apod/apod.component';
import { DatepickerComponent } from './datepicker';
import { SafePipe } from './safe.pipe';

@NgModule({
  declarations: [
    AppComponent,
    ApodComponent,
    DatepickerComponent,
    SafePipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AngualertModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
