import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx'
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { BarcodeScanner } from "@ionic-native/barcode-scanner/ngx";
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CommonModule } from '@angular/common';


// import { ChartsModule } from 'chartjs';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpClientModule, HttpClientXsrfModule, HTTP_INTERCEPTORS   } from '@angular/common/http';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    HttpClientModule,
    NgxDatatableModule,
    FormsModule,
    CommonModule
   ],

  providers: [StatusBar,
    LocationAccuracy,
    SplashScreen,
    AndroidPermissions,
    NativeGeocoder,
    BarcodeScanner,
    Geolocation,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy}],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
