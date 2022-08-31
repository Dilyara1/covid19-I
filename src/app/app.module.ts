import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from "../environments/environment";
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireDatabaseModule } from "@angular/fire/compat/database";
import { SignInComponent } from './sign-in/sign-in.component';
import { CovidInfoComponent } from './covid-info/covid-info.component';
import { HttpClientModule } from "@angular/common/http";
import { HeaderComponent } from './header/header.component';
import { DropdownComponent } from './shared/dropdown/dropdown.component';
import { FormsModule } from "@angular/forms";
import { LineChartComponent } from './shared/line-chart/line-chart.component';
import { ChartsModule } from "ng2-charts";

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    CovidInfoComponent,
    HeaderComponent,
    DropdownComponent,
    LineChartComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    FormsModule,
    ChartsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
