import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class WeatherServiceService {
  url = "https://api.openweathermap.org/data/2.5/weather"
  apiKey = "3d7be02fc98f4c9a972b9014e92c7b8a"

  constructor(
    private http: HttpClient
    ) {}

  getWeatherData (lat, lon) {
    let params = new HttpParams()
    .set('lat', lat)
    .set('lon', lon)
    .set('units', 'imperial')
    .set('appId', this.apiKey)

/*     This will return a weather observable of the initial city
    so it can be subscribed to listen on it */
    return this.http.get(this.url, {params})
  }

  getWeatherDataFromCity (cityName: string) {
    let params = new HttpParams()
    .set('q', cityName)
    .set('units', 'imperial')
    .set('appId', this.apiKey)

/*     This will return a weather observable of a given city
    so it can be subscribed to listen on it */
    return this.http.get(this.url, {params})
  }
}
