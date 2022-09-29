import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IpaddressService } from '../../service/ipaddress.service';
import { Chart } from 'chart.js';
import { Platform } from '@ionic/angular';
import { TableSampleService } from '../table-sample.service';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-pmsdashboard',
  templateUrl: './pmsdashboard.page.html',
  styleUrls: ['./pmsdashboard.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PmsdashboardPage implements OnInit {
  //   @ViewChild('pieChart') pieChart: { nativeElement: any; };

  students: any[];
  username: any;
  chartLoading: any;
  userid: any;

  options = { checkboxes: true }
  data: any = [];
  dataStatus : any =[];
  dataDetails : any =[];
  dataVaccant : any =[];
  dataRaised : any =[];


  columns: any = [];
  columnsStatus: any = [];
  columnsDetails: any = [];
  columnsVaccant: any = [];
  columnsRaised : any = [];
  rows: any



  @ViewChild('sourcecanvas1') sourcecanvas1;

  constructor(private http: HttpClient, private platform: Platform, public Ipaddressservice: IpaddressService, private tableApi: TableSampleService) {
    this.userid = window.localStorage['TUM_USER_ID'];
    this.username = localStorage.getItem('TUM_USER_NAME');
    this.getCategoryCountChart();

    this.columns = [
      { name: 'sno', width: "50"},
      { name: 'invoice', width: "100" },
      { name: 'month', width: "100" },
      { name: 'amount', width: "100" },
      { name: 'status', width: "100" },
    ];

    this.columnsStatus = [
      { name: 'sno', width: "50"},
      { name: 'readBy', width: "100" },
      { name: 'description', width: "100" },
      { name: 'status', width: "100" },
    ];

    this.columnsDetails = [
      { name: 'sno', width: "50"},
      { name: 'propertycode', width: "100" },
      { name: 'issuedescription', width: "100" },
      { name: 'status', width: "100" },
    ];

    this.columnsVaccant = [
      { name: 'sno', width: "50"},
      { name: 'propertycode', width: "100" },
      { name: 'issuedescription', width: "100" },
      { name: 'flat', width: "100" },
    ];

    this.columnsRaised = [
      { name: 'sno', width: "50"},
      { name: 'propertycode', width: "100" },
      { name: 'invoice', width: "100" },
      { name: 'amount', width: "100" },
      { name: 'status', width: "100" },
    ];
  }

  ngOnInit() {
    debugger;
    this.data = this.tableApi.getDashbTable1();
    console.log(this.data);

    this.dataStatus = this.tableApi.getDashbTable2();
    console.log(this.dataStatus);

    this.dataDetails = this.tableApi.getDashbTable3();
    console.log(this.dataDetails);

    this.dataVaccant = this.tableApi.getDashbTable4();
    console.log(this.dataVaccant);

    this.dataRaised = this.tableApi.getDashbTable5();
    console.log(this.dataRaised);

  }

  getCategoryCountChart = function () {
    debugger;
    var sourcearray = [];
    const header = new Headers();
    header.append("Content-Type", "application/json");

    let options = new HttpHeaders().set('Content-Type', 'application/json');     
    this.http.get(this.Ipaddressservice.ipaddress1 + this.Ipaddressservice.serviceurlProperty + ' customerpayments?strfunction=1&branch=1&userid=1').subscribe(resp => {
      debugger
      this.result = resp;

      this.CategoryCount = this.result;
      console.log(this.CategoryCount);
      this.labels2 = [];
      this.data2 = [];
      for (var i = 0; i < this.CategoryCount.length; i++) {
        // $scope.labels2[i] = $scope.CategoryCount[i].AssetCategory + '-' + $scope.CategoryCount[i].AssetCount;
        this.labels2[i] = this.CategoryCount[i].AssetCategory + ' - ' + this.CategoryCount[i].AssetCount;
        this.data2[i] = this.CategoryCount[i].AssetCount;
      }
      console.log(this.labels2);
      console.log(this.data2);
      const canvas = <HTMLCanvasElement>document.getElementById('myChart');
      const ctx = canvas.getContext('2d');
      // var ctx = document.getElementById("myChart");
      var myChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: this.labels2,
          datasets: [{
            label: this.labels2,
            data: this.data2,
            backgroundColor: ['rgba(247,70,74,1)', 'rgba(220,220,220,1)', 'rgba(151,187,205,1)', 'rgba(70,191,189,1)', 'rgba(253,180,92,1)', 'rgba(148,159,177,1)', 'rgba(77,83,96,1)', 'rgba(103,16,103,1)', 'rgba(165,131,134,1)', '#FF4500', '#800000', '#00BFFF ', '#000000', '#00FF00', '#008080', '#FF00FF']

          }]
        },
        options: {
          responsive: true,
          fullwidth: true,
          legend: {
            display: true,
            align: 'start',
            position: 'bottom',
            verticalAlign: "center",
            labels: {
              boxWidth: 20,
              padding: 20
            }
          }
        }
      });

    }, error => {


    });

  }



}
