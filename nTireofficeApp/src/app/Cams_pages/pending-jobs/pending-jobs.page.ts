import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IpaddressService} from '../../service/ipaddress.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
// import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner/ngx';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
declare var jquery: any;
declare var $: any;
import {TabparamserviceService} from '../../service/tabparamservice.service';

@Component({
  selector: 'app-pending-jobs',
  templateUrl: './pending-jobs.page.html',
  styleUrls: ['./pending-jobs.page.scss'],
})
export class PendingJobsPage implements OnInit {

  function:any;
  branch:any;
  fromdate;
  todate;
  fromdate2;
  todate2;
  Realease_status:any;
  assetcode1;
  isItemAvailable:boolean;
  assetcode1str:any;
  assetcodeResult:any;
  assetCode:any;
  carddata:any;
  responseData:any;
  branch1:any;
  userID:any;
  usertype:any;
  responseDatalength:any;
  product:any;
  category:any;
  subCategory:any;
  subCategoryresp:any;
  datefiliterdata:any;
  username:any;
  jobs:any;
  scannedCode;
  constructor(private Tabparams:TabparamserviceService,private datePipe: DatePipe, public alertController: AlertController, private zone: NgZone, private http: HttpClient, public Ipaddressservice: IpaddressService,private router: Router,private barcodeScanner: BarcodeScanner) {
    //,private qrScanner: QRScanner
    this.function = localStorage.getItem('FUNCTION_DESC');
    this.branch = localStorage.getItem('TUM_BRANCH_CODE');
    this.userID = localStorage.getItem('TUM_USER_ID');
    this.usertype = localStorage.getItem('TUM_USER_TYPE');
    this.username=localStorage.getItem('TUM_USER_NAME');


    this.fromdate = this.datePipe.transform(this.fromdate, 'yyyy-MM-dd');
    this.todate = this.datePipe.transform(this.todate, 'yyyy-MM-dd');
    this.Realease_status= "<< Select >>";
    this.jobs="<< Select >>";
    this.category="<< Select >>";
    this.subCategory="<< Select >>";
    this.getCards();
    
  }

  ngOnInit() {
    
    this.getAssertCatergory();
  }

  doRefresh(event){
    this.getCards();
    this.getAssertCatergory();
    this.assetCode='';
  event.target.complete();
  }

  getItems(ev: any) {
    this.assetcode1 = [];
    if (ev.target.value == "") {
      this.assetcode1 = [];
      this.isItemAvailable = false;
    }
    // Reset items back to all of the items
    const header = new Headers();
    header.append("Content-Type", "application/json");

    let options = new HttpHeaders().set('Content-Type', 'application/json');

    var params = {
      access_token: window.localStorage['token'],
      userid: window.localStorage['TUM_USER_ID'],
      'usertoken': window.localStorage['usertoken'],
      USER_ID: window.localStorage['TUM_USER_ID'],
    };
    this.http.post(this.Ipaddressservice.ipaddress+this.Ipaddressservice.serviceurlCamsNode +'/assetcodelist',params, {
      headers: options,
    }).subscribe(resp => {
      console.log(resp)
      // set val to the value of the searchbar
      this.assetcodeResult= resp;
      this.assetcode1str = this.assetcodeResult;

      for (var i = 0; i < this.assetcode1str.length; i++) {

        this.assetcode1.push(this.assetcode1str[i].ASSET_CODE);
      }
      const val = ev.target.value;

      // if the value is an empty string don't filter the items
      if (val && val.trim() != '') {
        this.isItemAvailable = true;
        this.assetcode1 = this.assetcode1.filter((item) => {
          return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
      }

    }, error => {
      //this.presentAlert('Alert','Server Error,Contact not loaded');
      console.log("error : " + JSON.stringify(error));

    });

  }

  scanpendingasset(){
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);
      this.scannedCode=barcodeData.text;
      this.adddata(this.scannedCode)
      }).catch(err => {
      console.log('Error', err);
      });
  }

  adddata(item) {

    this.assetCode = item;
    this.isItemAvailable = false;
    }


    getCards() {

      const header = new Headers();
    header.append("Content-Type", "application/json");

    let options = new HttpHeaders().set('Content-Type', 'application/json');
    this.http.get(this.Ipaddressservice.ipaddress1+this.Ipaddressservice.serviceurlCams+'Pendingsearchs11/1/1/%20/%20/%20/'+this.userID+'/'+this.usertype+'/%20/%20/MT', {
      
      headers: options,
    }).subscribe(resp => {
       this.carddata=resp;
       this.responseData = JSON.parse(this.carddata);
       console.log(this.responseData);
       this.responseDatalength = this.responseData.length;
       this.branch1 = this.responseData[0].Branch;
    }, error => {

      console.log(JSON.stringify(error));
    });

  };

  requestedJobs() {
    console.log(this.jobs)
   // this.responseData = {};

   if(this.Realease_status == "<< Select >>" || this.Realease_status == undefined){
    var status = " ";
   }else{
    status= this.Realease_status
   }

   if(this.jobs == "<< Select >>" || this.jobs == undefined){
    var jobs = 'MT';
   }else{
    jobs= this.jobs
   }

   if(this.category == "<< Select >>" || this.category == undefined){
    var assetCat = ' ';
   }else{
    assetCat= this.category
   }

   if(this.subCategory == "<< Select >>" || this.subCategory == undefined){
    var assetSubCat = ' ';
   }else{
    assetSubCat= this.subCategory
   }

   if(this.fromdate == "<< Select >>" || this.fromdate == undefined){
    var fromdate = ' ';
   }else{
    this.fromdate2 = this.datePipe.transform(this.fromdate, 'dd-MM-yyyy');
    fromdate= this.fromdate2
   }

   if(this.todate == "<< Select >>" || this.todate == undefined){
    var todate = ' ';
   }else{
    this.todate2 = this.datePipe.transform(this.todate, 'dd-MM-yyyy');
    todate= this.todate2
   }
    const header = new Headers();
    header.append("Content-Type", "application/json");

    let options = new HttpHeaders().set('Content-Type', 'application/json');
    this.http.get(this.Ipaddressservice.ipaddress1+this.Ipaddressservice.serviceurlCams+'Pendingsearchs11?strfunction=1&branch=1&fdate='+fromdate+'&tdate='+todate+'&Status='+ status +'&strUserId='+this.userID+'&UserType='+this.usertype+'/'+assetCat+'/'+assetSubCat+'/'+jobs, {
                                                      // ?strfunction=1&branch=1&fdate=null&tdate=null&Status=P&strUserId=null&UserType=null
      headers: options,
    }).subscribe(resp => {
      console.log(resp);
      this.carddata=resp;
      this.responseData = JSON.parse(this.carddata);
      console.log(this.responseData);
      this.responseDatalength = this.responseData.length;
      this.branch1 = this.responseData[0].Branch;
        
    }, error => {

      console.log(JSON.stringify(error));
    });
}

showmore(idvalue) {
    //        alert(idvalue);
    $("#dividvalsp" + idvalue).css("display", "block");
    $("#imageidvalsp" + idvalue).hide();
}
showless(idvalue) {
    //        alert(idvalue);
    $("#dividvalsp" + idvalue).css("display", "none");
    $("#imageidvalsp" + idvalue).show();
};

getAssertCatergory(){
  const header = new Headers();
  header.append("Content-Type", "application/json");

  let options = new HttpHeaders().set('Content-Type', 'application/json');

  var assetCatParms = {
    functionidrep: localStorage.getItem('FUNCTION_ID'),
    access_token: localStorage.getItem('token'),
    userid: localStorage.getItem('TUM_USER_ID'),
    'usertoken': localStorage.getItem('usertoken'),
    USER_ID: localStorage.getItem('TUM_USER_ID'),
  };
  this.http.post(this.Ipaddressservice.ipaddress+this.Ipaddressservice.serviceurlCamsNode +'/assetlocationcategory',assetCatParms, {
    headers: options,
  }).subscribe(resp => {
    console.log(resp)
    //var fulldata = resp.data;
    this.product = resp;
    console.log(this.product);

  }, error => {
    //this.presentAlert('Alert','Server Error,Contact not loaded');
    console.log("error : " + JSON.stringify(error));

  });
}

getsubCategory(event){
  console.log(event)
  const header = new Headers();
  header.append("Content-Type", "application/json");

  let options = new HttpHeaders().set('Content-Type', 'application/json');

  var assetCatParms = {
    functionidrep: localStorage.getItem('FUNCTION_ID'),
    access_token: localStorage.getItem('token'),
    userid: localStorage.getItem('TUM_USER_ID'),
    'usertoken': localStorage.getItem('usertoken'),
    USER_ID: localStorage.getItem('TUM_USER_ID'),
    categoryid:parseInt(event)
  };
  this.http.post(this.Ipaddressservice.ipaddress+this.Ipaddressservice.serviceurlCamsNode +'/assetlocationsubcategory',assetCatParms, {
    headers: options,
  }).subscribe(resp => {
    console.log(resp)
    //var fulldata = resp.data;
    this.subCategoryresp = resp;
    console.log(this.product);

  }, error => {
    //this.presentAlert('Alert','Server Error,Contact not loaded');
    console.log("error : " + JSON.stringify(error));

  });
}

pendateval() {
  console.log("test");
  var from = this.fromdate;
  var from_timestamp = new Date(from).getTime();
  var to = this.todate;
  var to_timestamp = new Date(to).getTime();
  console.log(from_timestamp +'-'+ to_timestamp);
  if (from != null) {
      if (from_timestamp <= to_timestamp) {
        const header = new Headers();
        header.append("Content-Type", "application/json");
      
        let options = new HttpHeaders().set('Content-Type', 'application/json');
        this.http.get(this.Ipaddressservice.ipaddress1+this.Ipaddressservice.serviceurlCams+'Pendingsearchs11?strfunction=1&branch=1&fdate=null&tdate=null&Status=P&strUserId='+this.userID+'&UserType='+this.usertype, {
                                                            // ?strfunction=1&branch=1&fdate=null&tdate=null&Status=P&strUserId=null&UserType=null
          headers: options,
        }).subscribe(resp => {
              // alert(JSON.stringify(response));
              var remove_array = [];
              var add_array = [];
              this.datefiliterdata = resp;
              //$scope.responseData = [];
              this.responseData = JSON.parse(this.datefiliterdata);
              for (var i = 0; i < this.responseData.length; i++) {
                  var newtemp = this.responseData[i].pm_due_date.split("/");
                  var newDate = newtemp[1] + "/" + newtemp[0] + "/" + newtemp[2];
                  var pmDate_timestamp = new Date(newDate).getTime();
                  if (from_timestamp <= pmDate_timestamp && to_timestamp >= pmDate_timestamp) { } else {
                      remove_array.push(i);
                  }
              }
              remove_array.sort(function (a, b) { return b - a });
              for (var j = 0; j < remove_array.length; j++) {
                  this.responseData.splice(remove_array[j], 1);
              }
              console.log(this.responseData);
              this.responseDatalength = this.responseData.length;
            }, error => {
              //this.presentAlert('Alert','Server Error,Contact not loaded');
              console.log("error : " + JSON.stringify(error));
          
            });
      } else {
        this.presentAlert("Invalid date", "From date should be lesser than To date!");
      }
  } else {
    this.presentAlert("Invalid date", "From Date should not be empty!");
  }
};

async presentAlert(heading, tittle) {
  var alert = await this.alertController.create({
    header: heading,
    cssClass:'buttonCss',
    message: tittle,
    buttons: ['OK']
  });

  await alert.present();
}

startwork(obj, duedate,alldata) {
  var pduedte = duedate;
  var todayDate = new Date();
  var day = todayDate.getDate();
  var month = todayDate.getMonth() + 1;
  var year = todayDate.getFullYear();
  var finaltodayDatep = day + "/" + month + "/" + year;
  var newtdate = year + "-" + month + "-" + day;
  console.log(pduedte);
  console.log(finaltodayDatep);
  var pduedte_array = pduedte.split('/');
  var new_pduedte = pduedte_array[1]+'/'+pduedte_array[0]+'/'+pduedte_array[2];
  var new_pduedte1 = new Date(new_pduedte).getTime();
  var finaltodayDatep_array = finaltodayDatep.split('/');
  var new_finaltodayDatep = finaltodayDatep_array[1]+'/'+finaltodayDatep_array[0]+'/'+finaltodayDatep_array[2];
  var new_finaltodayDatep1 = new Date(new_finaltodayDatep).getTime();
  if (new_finaltodayDatep1 == new_pduedte1 || new_finaltodayDatep1 > new_pduedte1) {
      //alert("datein")
      // alert(obj);
     
      var datarep = {
        'wrkno': obj,
        'functionid':window.localStorage['FUNCTION_ID'],
        'branchid':window.localStorage['TUM_BRANCH_ID'],
        'activityid':alldata.CMD_ACTIVITY_ID,
        'duedate':alldata.pm_due_date,
        'assetid':alldata.CMD_ASSET_ID,
        'ref':alldata.pmr_reference,
        'startdte': newtdate,
        'access_token':window.localStorage['token'],
        'userid':this.userID,
        'usertoken':localStorage.getItem('usertoken'),

      }
      console.log(datarep);
      const header = new Headers();
      header.append("Content-Type", "application/json");
    
      let options = new HttpHeaders().set('Content-Type', 'application/json');
      this.http.post(this.Ipaddressservice.ipaddress+this.Ipaddressservice.serviceurlCamsNode +'/updatecamsstatus',datarep, {
        headers: options,
      }).subscribe(resp => {
          console.log(resp);
          if(resp == 'Updated Successfully'){
            this.presentAlert("Alert","Successfully Started");
            this.getCards();
          }
      }, error => {
      
              console.log("error : " + JSON.stringify(error));
          
      });
      this.Realease_status = 'Started';

      this.getCards();
  } else {
      alert("Future Date task Cannot be Started");
  }
}

pendingtab(item){
  console.log(item)
  this.Tabparams.data=item;
  this.router.navigate(['/pending-jobs-tabs', {
    item:JSON.stringify(item)
  }])
 
  //this.router.navigateByUrl('pending-jobs-tabs');
}
}
