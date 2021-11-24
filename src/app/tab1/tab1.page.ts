/* eslint-disable @typescript-eslint/semi */
import { WeatherServiceService } from './../services/weather-service.service';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import Chart from 'chart.js/auto';
import { getRelativePosition } from 'chart.js/helpers';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit, AfterViewInit {
  // Importing ViewChild. We need @ViewChild decorator to get a reference to the local variable 
  // that we have added to the canvas element in the HTML template.
  @ViewChild('lineCanvas') private lineCanvas: ElementRef
  
  lineChart: any
  doubleLineChart: any

  lat: any
  lon: any
  currentWeather: any;
  foreCastWeather: any
  searchedCity: string
  bars: any
  colorArray: any
  foreCastDates: []

  constructor(
    private weatherService: WeatherServiceService,
    private toastController: ToastController) { }

      // When we try to call our chart to initialize methods in ngOnInit() it shows an error nativeElement of undefined. 
  // So, we need to call the chart method in ngAfterViewInit() where @ViewChild and @ViewChildren will be resolved.
  ngAfterViewInit() {
    //Initially
    this.getForecastData("Paderborn")
    setTimeout( () => { this.onDrawLineChart() }, 2000 );
  }

  ngOnInit() {
    /*  Asks and gets the current user location
        so that i can provide weather data  */
    this.getCurrentUserLocation();
  }

  /* Returns the formatted temperature value as celsius */
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

 getForecastData (forecastValue: string) {
  this.weatherService.getWeatherForecastDataByCity(forecastValue, 3).subscribe(foreCastData => {
    this.foreCastWeather = foreCastData
    console.log(foreCastData)
    this.onDrawLineChart()
  })
 }

  getWeatherIcon = (icon: string) => `https://openweathermap.org/img/wn/${icon}.png`;

  onSearch = () => {
    this.weatherService.getWeatherDataFromCity(this.searchedCity).subscribe(weatherData => {
      this.currentWeather = weatherData
    });
    //Get forecast data of searched city
    this.getForecastData(this.searchedCity)
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
          console.log('Cancel clicked')
        }
      }
      ]
    });
    await toast.present();

    const { role } = await toast.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  formatDayAndTimeString(dayTime: string){
    return dayTime
  }

  // We just need data of one day, this is why i can take it like that
  foreCastLabelsHelper(index: number, type: string) {
    switch (type) {
    case "labels": {
    return this.foreCastWeather.list[index].dt_txt
    .substring(11, this.foreCastWeather.list[index].dt_txt.length - 6)+" '"
  }
  case "dataTemp": {
    return this.onConvertFahrenheit(this.foreCastWeather.list[index].main.temp)
  }
  case "dataAirPressure": {
    return this.onConvertMilesToKilo(this.foreCastWeather.list[index].wind.speed)
  }
  case "dataHumidity": {
    return this.foreCastWeather.list[index].main.humidity
  }
  }
  }

  translateUnixTimestamp (timestamp: number) {
   return new Date(timestamp * 1000).toDateString()
  }

  onDrawLineChart() {
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: [this.foreCastLabelsHelper(0, "labels"), this.foreCastLabelsHelper(1, "labels"), this.foreCastLabelsHelper(2, "labels")],
        datasets: [
          {
            label: 'Temperature',
            fill: false,
            tension: 0.1,
            backgroundColor: 'rgba(75,192,192,0.4)',
            borderColor: 'rgba(75,192,192,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(75,192,192,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 5,
            pointHitRadius: 10,
            data: [this.foreCastLabelsHelper(0, "dataTemp"), 
            this.foreCastLabelsHelper(1, "dataTemp"), 
            this.foreCastLabelsHelper(2, "dataTemp")],
            spanGaps: false,
          }, 
          {
            label: 'Humidity',
            fill: false,
            tension: 0.1,
            backgroundColor: 'rgba(40,160,20,0.4)',
            borderColor: 'rgba(40,160,20,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(40,160,20,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(40,160,20,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 5,
            pointHitRadius: 10,
            data: [this.foreCastLabelsHelper(0, "dataHumidity"), 
            this.foreCastLabelsHelper(1, "dataHumidity"), 
            this.foreCastLabelsHelper(2, "dataHumidity")],
            spanGaps: false,
          }, 
          {
            label: 'Air pressure',
            tension: 0.1,
            fill: false,
            backgroundColor: 'rgba(120,20,80,0.4)',
            borderColor: 'rgba(120,20,80,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(120,20,80,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(120,20,80,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 5,
            pointHitRadius: 10,
            data: [this.foreCastLabelsHelper(0, "dataAirPressure"), 
            this.foreCastLabelsHelper(1, "dataAirPressure"), 
            this.foreCastLabelsHelper(2, "dataAirPressure")],
            spanGaps: false,
          }
        ]
      }
    });
  }
}

