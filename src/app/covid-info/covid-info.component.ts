import { Component, OnInit } from '@angular/core';
import { CovidInfoService } from "../services/covid-info.service";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { CovidStatus } from "../models/enums/enums";

@Component({
  selector: 'app-covid-info',
  templateUrl: './covid-info.component.html',
  styleUrls: ['./covid-info.component.scss']
})
export class CovidInfoComponent implements OnInit {
  covidCases = {};
  selectedCase: any;
  latestCovidData: any;
  constructor(private covidInfoService: CovidInfoService) { }

  ngOnInit(): void {
    this.fetchCovidCases().subscribe((covidCases) => {
      this.covidCases = covidCases;
    });
    this.fetchCovidHistory(CovidStatus.CONFIRMED, 'France').subscribe();
  }

  fetchCovidCases(country?: string, ab?: string, continent?: string): Observable<any> {
    return this.covidInfoService.getCovidCases(country, ab, continent).pipe(map((cases) => {
      return cases;
    }));
  }

  fetchCovidHistory(status: CovidStatus, country?: string, ab?: string, continent?: string): Observable<any> {
    return this.covidInfoService.getCovidHistory(status, country, ab, continent).pipe(map((history) => {
      console.log(history.All)
      if (history.All) {
        const dates = history.All.dates;
        const data = Object.entries(dates)[0];
        this.latestCovidData = {latestDate: data[0], latestNumber: data[1]};
      }
    }));
  }
}
