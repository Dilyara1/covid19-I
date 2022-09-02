import { Component, OnInit } from '@angular/core';
import { CovidInfoService } from "../services/covid-info.service";
import { Observable } from "rxjs";
import { finalize, map } from "rxjs/operators";
import { CovidStatus } from "../models/enums/enums";

@Component({
  selector: 'app-covid-info',
  templateUrl: './covid-info.component.html',
  styleUrls: ['./covid-info.component.scss']
})
export class CovidInfoComponent implements OnInit {
  covidCases: any[] = [];
  latestCovidData: any;
  regionLabels: any[] = [];
  chartData: any;
  chartDataConfirmed: any;
  vaccinePercent: any;
  countries: any[] = [];
  country: any;
  pieChartData: any;
  pieChartDataConfirmed: any;
  isPieChart = false;
  isLoading = false;
  covidInfo: any;

  constructor(private covidInfoService: CovidInfoService) {
  }

  ngOnInit(): void {
    this.getCountries();
  }

  getCountries() {
    this.fetchCovidCases().subscribe((cases) => {
      if (Object.keys(cases)?.length > 0) {
        this.countries = Object.keys(cases)
          .map((key) => {
            return key;
          });
      }
    })
  }

  getCountry(country: any) {
    this.country = country;
    if (this.country) {
      this.isLoading = true;
      this.resetData();
      this.fetchCovidHistory(CovidStatus.CONFIRMED, this.country).subscribe();
      this.fetchCovidVaccines(this.country).subscribe();
      this.fetchCovidCases(this.country).pipe(finalize(() => {
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
        this.latestCovidData = {latestDate: data[0], latestNumber: data[1]};
      }
    }));
  }

  fetchCovidVaccines(country: string): Observable<any> {
    return this.covidInfoService.getCovidVaccines(country).pipe(map((vaccine) => {
      if (vaccine.All) {
        const vaccineData = vaccine.All;
        if (vaccineData?.people_vaccinated) {
          this.vaccinePercent = (vaccineData?.people_vaccinated / vaccineData.population) * 100;
          this.vaccinePercent = this.vaccinePercent.toFixed(2) + '%';
        } else {
          this.vaccinePercent = '0%';
        }
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
    this.latestCovidData = null;
    this.pieChartData = null;
    this.pieChartDataConfirmed = null;
    this.chartData = null;
    this.chartDataConfirmed = null;
  }
}
