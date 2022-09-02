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
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LineChartComponent } from './shared/line-chart/line-chart.component';
import { ChartsModule } from "ng2-charts";
import { AuthGuardService } from "./services/guard/auth.guard.service";
import { AngularFireStorageModule } from "@angular/fire/compat/storage";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatInputModule } from "@angular/material/input";
import { PieChartComponent } from './shared/pie-chart/pie-chart.component';
import { ThemeService } from "./services/theme.service";

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    CovidInfoComponent,
    HeaderComponent,
    DropdownComponent,
    LineChartComponent,
    PieChartComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
    MatAutocompleteModule,
    MatInputModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [
    AuthGuardService,
    ThemeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
