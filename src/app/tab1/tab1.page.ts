import { WeatherServiceService } from './../services/weather-service.service';
import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  lat: any;
  lon: any;
  currentWeather: any;
  searchedCity: string

  constructor(private weatherService: WeatherServiceService) {}

  ngOnInit() {
/*  Asks and gets the current user location 
    so that i can provide weather data  */
    this.getCurrentUserLocation();
  }

  /* Returns the formatted temperature value as celsius */
  onConvertFahrenheit = (tempValue: string) => {
    return (Math.round(((parseInt(tempValue) - 32) * 5) / 9 * 100) / 100).toFixed(1);
  }

  onConvertMilesToKilo = (speedValue) => {
    return (Math.round(speedValue * 1.609 * 100) / 100).toFixed(2);
  }

  getCurrentUserLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.watchPosition((value) => {
        this.lat = value.coords.latitude;
        this.lon = value.coords.longitude;

        this.weatherService
          .getWeatherData(this.lat, this.lon)
          .subscribe((data) => {
            this.currentWeather = data;
            console.log(this.currentWeather);
          });
      });
    }
  }

  getWeatherIcon = (icon: string) => {
    return `https://openweathermap.org/img/wn/${icon}.png`
  }

  onSearch = () => {
    this.weatherService.getWeatherDataFromCity(this.searchedCity).subscribe( weatherData => {
      this.currentWeather = weatherData
    })
  }
}
