/* eslint-disable @typescript-eslint/semi */
import { WeatherServiceService } from './../services/weather-service.service';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { Chart } from 'chart.js';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit, AfterViewInit {

  barChart: any;
  doughnutChart: any;
  lineChart: any;
  doubleLineChart: any;

  lat: any;
  lon: any;
  currentWeather: any;
  searchedCity: string;
  bars: any;
  colorArray: any;

  constructor(
    private weatherService: WeatherServiceService,
    private toastController: ToastController) { }
  ngAfterViewInit() {

  }

  ngOnInit() {
    /*  Asks and gets the current user location
        so that i can provide weather data  */
    this.getCurrentUserLocation();
  }

  /* Returns the formatted temperature value as celsius */
  // eslint-disable-next-line radix
  onConvertFahrenheit = (tempValue: string) => (Math.round(((parseInt(tempValue) - 32) * 5) / 9 * 100) / 100).toFixed(1);

  onConvertMilesToKilo = (speedValue) => (Math.round(speedValue * 1.609 * 100) / 100).toFixed(2);

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

  getWeatherIcon = (icon: string) => `https://openweathermap.org/img/wn/${icon}.png`;

  onSearch = () => {
    this.weatherService.getWeatherDataFromCity(this.searchedCity).subscribe(weatherData => {
      this.currentWeather = weatherData
    });
  };

  async presentWarnToast(title: string, msg: string) {
    const toast = await this.toastController.create({
      header: title,
      message: msg,
      position: 'bottom',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }
      ]
    });
    await toast.present();

    const { role } = await toast.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }
}

