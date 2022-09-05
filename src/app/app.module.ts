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
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { LineChartComponent } from './shared/components/line-chart/line-chart.component';
import { ChartsModule } from "ng2-charts";
import { AuthGuardService } from "./services/guard/auth.guard.service";
import { AngularFireStorageModule } from "@angular/fire/compat/storage";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { AngularFirestoreModule } from "@angular/fire/compat/firestore";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PieChartComponent } from './shared/components/pie-chart/pie-chart.component';
import { ThemeService } from "./services/theme.service";
import { LoadingComponent } from './shared/components/loading/loading.component';
import { CustomDropdownComponent } from './shared/components/custom-dropdown/custom-dropdown.component';
import { ClickedOutsideDirective } from './shared/directives/clicked-outside/clicked-outside.directive';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    CovidInfoComponent,
    HeaderComponent,
    LineChartComponent,
    PieChartComponent,
    LoadingComponent,
    CustomDropdownComponent,
    ClickedOutsideDirective
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
