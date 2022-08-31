import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { CovidStatus } from "../models/enums/enums";

const API_BASE = 'https://covid-api.mmediagroup.fr/v1';
const API_CASES = API_BASE + '/cases';
const API_HISTORY = API_BASE + '/history';
const API_VACCINES = API_BASE + '/vaccines';

@Injectable({
  providedIn: 'root'
})

export class CovidInfoService {

  constructor(private httpClient: HttpClient) { }

  getCovidCases(country?: string, ab?: string, continent?: string): Observable<any> {
    let params = new HttpParams();
    if (country) {
      params = params.append('country', country);
    }
    if (ab) {
      params = params.delete('country');
      params = params.append('ab', ab);
    }
    if (continent) {
      params = params.delete('country');
      params = params.append('continent', continent);
    }
    console.log(params)
    return this.httpClient.get(API_CASES, {params});
  }

  getCovidHistory(status: CovidStatus, country?: string, ab?: string, continent?: string): Observable<any> {
    let params = new HttpParams().append('status', status);
    if (country) {
      params = params.append('country', country);
    }
    if (ab) {
      params = params.delete('country');
      params = params.append('ab', ab);
    }
    if (continent) {
      params = params.delete('country');
      params = params.append('continent', continent);
    }
    return this.httpClient.get(API_HISTORY, {params});
  }

  getCovidVaccines(country?: string, ab?: string, continent?: string): Observable<any> {
    let params = new HttpParams();
    if (country) {
      params = params.append('country', country);
    }
    if (ab) {
      params = params.delete('country');
      params = params.append('ab', ab);
    }
    if (continent) {
      params = params.delete('country');
      params = params.append('continent', continent);
    }
    console.log(params)
    return this.httpClient.get(API_VACCINES, {params});
  }
}
