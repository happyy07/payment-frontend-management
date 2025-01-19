import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface CountryResponse {
  error: boolean;
  msg: string;
  data: Array<{
    name: string;
    Iso2: string;
    Iso3: string;
  }>;
}

interface StateResponse {
  error: boolean;
  msg: string;
  data: {
    name: string;
    states: Array<{
      name: string;
      state_code: string;
    }>;
  };
}

interface CityResponse {
  error: boolean;
  msg: string;
  data: string[];
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private apiUrl = 'https://countriesnow.space/api/v0.1';

  constructor(private http: HttpClient) {}

  getCountries(): Observable<{ name: string; code: string }[]> {
    return this.http.get<CountryResponse>(`${this.apiUrl}/countries/iso`)
      .pipe(
        map(response => response.data.map(country => ({
          name: country.name,
          code: country.Iso2
        })))
      );
  }

  getStates(country: string): Observable<string[]> {
    return this.http.post<StateResponse>(`${this.apiUrl}/countries/states`, { country })
      .pipe(
        map(response => response.data.states.map(state => state.name))
      );
  }

  getCities(country: string, state?: string): Observable<string[]> {
    const payload = state ? { country, state } : { country };
    return this.http.post<CityResponse>(
      `${this.apiUrl}/countries/state/cities`,
      payload
    ).pipe(
      map(response => response.data)
    );
  }
} 