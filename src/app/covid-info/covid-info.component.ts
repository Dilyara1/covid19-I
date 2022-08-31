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
  covidCases: any[] = [];
  selectedCase: any;
  latestCovidData: any;
  regionLabels: any[] = [];
  chartData: any;
  chartDataConfirmed: any;
  vaccinePercent: any;

  constructor(private covidInfoService: CovidInfoService) { }

  ngOnInit(): void {
    this.fetchCovidCases('France').subscribe((covidCases) => {
      for (let [key, value] of Object.entries(covidCases)) {
        if (key !== 'All') {
          this.regionLabels.push(key);
          this.covidCases.push(value);
        }
      }
      this.chartData = {
        data: this.getChartDataList(),
        regionLabels: this.regionLabels,
        colors: [{
          borderColor: 'black',
          backgroundColor: 'rgba(255,0,0,0.28)',
        },
          {
            borderColor: 'green',
            backgroundColor: 'rgba(0,255,0,0.28)',
          },]
      }
      this.chartDataConfirmed = {
        data: [this.getChartData(CovidStatus.CONFIRMED)],
        regionLabels: this.regionLabels,
        colors: [{
          borderColor: 'black',
          backgroundColor: 'rgba(255,255,0,0.28)',
        }]
      }
    });
    this.fetchCovidHistory(CovidStatus.CONFIRMED, 'France').subscribe();
    this.fetchCovidVaccines('France').subscribe();
  }

  getChartDataList() {
    const keys = [CovidStatus.DEATH, CovidStatus.RECOVERED];
    const data = [];
    for (let key of keys) {
      data.push(this.getChartData(key));
    }
    return data;
  }

  getChartData(key: CovidStatus) {
    const arr = this.covidCases.map((covidCase) => {
      return covidCase[key];
    });
    return { data: arr, label: key?.toUpperCase() };
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

  fetchCovidVaccines(country?: string, ab?: string, continent?: string): Observable<any> {
    return this.covidInfoService.getCovidVaccines(country, ab, continent).pipe(map((vaccine) => {
      vaccine = vaccine?.All;
      this.vaccinePercent = (vaccine?.people_vaccinated / vaccine.population) * 100;
      this.vaccinePercent = this.vaccinePercent.toFixed(2) + '%';
    }));
  }
}
