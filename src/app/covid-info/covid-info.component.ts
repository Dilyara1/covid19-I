import { Component, OnDestroy, OnInit } from '@angular/core';
import { CovidInfoService } from "../services/covid-info.service";
import { Observable, of, Subscription } from "rxjs";
import { finalize, map } from "rxjs/operators";
import { CovidStatus } from "../models/enums/enums";

@Component({
  selector: 'app-covid-info',
  templateUrl: './covid-info.component.html',
  styleUrls: ['./covid-info.component.scss']
})
export class CovidInfoComponent implements OnInit, OnDestroy {
  covidCases: any[] = [];
  covidCasesSubscription: Subscription;
  latestCovidData$: Observable<any>;
  regionLabels: any[] = [];
  chartData: any;
  chartDataConfirmed: any;
  vaccinePercent$: Observable<any>;
  countries$: Observable<any[]>;
  country: any;
  pieChartData: any;
  pieChartDataConfirmed: any;
  isPieChart = false;
  isLoading = false;
  covidInfo: any;

  constructor(private covidInfoService: CovidInfoService) {
  }

  ngOnInit(): void {
    this.countries$ = this.getCountries();
  }

  getCountries() {
    return this.fetchCovidCases().pipe(map((cases) => {
      if (Object.keys(cases)?.length > 0) {
        return  Object.keys(cases)
          .map((key) => {
            return key;
        });
      } else {
        return [];
      }
    }));
  }

  getCountry(country: any) {
    this.country = country;
    if (this.country) {
      this.isLoading = true;
      this.resetData();
      this.latestCovidData$ = this.fetchCovidHistory(CovidStatus.CONFIRMED, this.country);
      this.vaccinePercent$ = this.fetchCovidVaccines(this.country);
      this.covidCasesSubscription = this.fetchCovidCases(this.country).pipe(finalize(() => {
        this.isLoading = false;
      })).subscribe((covidCases) => {
        if (Object.keys(covidCases).length > 1) {
          for (let [key, value] of Object.entries(covidCases)) {
            if (key !== 'All') {
              this.regionLabels.push(key);
              this.covidCases.push(value);
            } else {
              this.covidInfo = value;
            }
          }
        } else {
          this.isPieChart = true;
          this.covidInfo = covidCases.All;
          this.covidCases = [covidCases.All];
        }
        this.generateChartsData();
      });
    }
  }

  fetchCovidHistory(status: CovidStatus, country: string): Observable<any> {
    return this.covidInfoService.getCovidHistory(status, country).pipe(map((history) => {
      if (history.All) {
        const dates = history.All.dates;
        const data = Object.entries(dates)[0];
        return {latestDate: data[0], latestNumber: data[1]};
      } else {
        return null;
      }
    }));
  }

  fetchCovidVaccines(country: string): Observable<any> {
    return this.covidInfoService.getCovidVaccines(country).pipe(map((vaccine) => {
      if (vaccine.All) {
        const vaccineData = vaccine.All;
        let vaccinePercent: string | number = '0%';
        if (vaccineData?.people_vaccinated) {
          vaccinePercent = (vaccineData?.people_vaccinated / vaccineData.population) * 100;
          vaccinePercent = vaccinePercent.toFixed(2) + '%';
        }
        return vaccinePercent;
      } else {
        return null;
      }
    }));
  }

  fetchCovidCases(country?: string): Observable<any> {
    return this.covidInfoService.getCovidCases(country);
  }

  generateChartsData() {
    if (!this.isPieChart) {
      this.chartData = {
        data: this.getChartDataList(),
        labels: this.regionLabels,
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
        labels: this.regionLabels,
        colors: [{
          borderColor: 'black',
          backgroundColor: 'rgba(255,255,0,0.28)',
        }]
      }
    } else {
      const pieChartAll = this.covidCases[0];
      const percentOverConfirmed = this.getPercentOverConfirmed(pieChartAll);
      this.pieChartData = {
        data: [percentOverConfirmed.deaths, percentOverConfirmed.recovered, percentOverConfirmed.other],
        labels: [CovidStatus.DEATHS.toUpperCase(), CovidStatus.RECOVERED.toUpperCase(), 'Health condition unknown']
      }
      const percentOverPopulation = this.getPercentOverPopulation(pieChartAll.confirmed, pieChartAll.population);
      this.pieChartDataConfirmed = {
        data: [percentOverPopulation.confirmed, percentOverPopulation.other],
        labels: [CovidStatus.CONFIRMED.toUpperCase(), 'HEALTHY']
      }
    }
  }

  getChartDataList() {
    const keys = [CovidStatus.DEATHS, CovidStatus.RECOVERED];
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
    return {data: arr, label: key?.toUpperCase()};
  }

  getPercentOverConfirmed(pieChartAll: any) {
    const deathPercent = (pieChartAll.deaths / pieChartAll.confirmed) * 100;
    const recoveredPercent = (pieChartAll.recovered / pieChartAll.confirmed) * 100;
    return {
      deaths: this.getFixed(deathPercent),
      recovered: this.getFixed(recoveredPercent),
      other: this.getFixed(100 - (deathPercent + recoveredPercent))
    };
  }

  getPercentOverPopulation(confirmed: number, population: number): any {
    if (confirmed && population) {
      const confirmedPercent = (confirmed / population) * 100;
      return {confirmed: this.getFixed(confirmedPercent), other: this.getFixed(100 - confirmedPercent)};
    }
  }

  getFixed(num: number): number {
    return +num.toFixed(2);
  }

  resetData() {
    this.isPieChart = false;
    this.covidCases = [];
    this.regionLabels = [];
    this.covidInfo = null;
    this.latestCovidData$ = of(null);
    this.pieChartData = null;
    this.pieChartDataConfirmed = null;
    this.chartData = null;
    this.chartDataConfirmed = null;
  }

  ngOnDestroy() {
    if (this.covidCasesSubscription) {
      this.covidCasesSubscription.unsubscribe();
    }
  }
}
