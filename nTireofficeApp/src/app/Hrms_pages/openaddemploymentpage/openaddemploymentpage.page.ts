import { Component, OnInit } from '@angular/core';
import {NavParams} from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttprequestService } from '../../service/httprequest.service';
import { IpaddressService } from '../../service/ipaddress.service';
import {ToastmessageService} from '../../service/toastmessage.service';
import {ModalController} from '@ionic/angular';

@Component({
  selector: 'app-openaddemploymentpage',
  templateUrl: './openaddemploymentpage.page.html',
  styleUrls: ['./openaddemploymentpage.page.scss'],
})
export class OpenaddemploymentpagePage implements OnInit {
  employmentdetails=[];
  // Designation=[];
  Designationresp:any=[];
  tempID: string;
  addCareerObject={
    empID:'',
    Type:'',
    Employer:'',
    From:'',
    To:'',
    Designation:'',
    Salary:'',
    ID:''
  }
  employer: string;
  fromdate: string;
  toDate: string;
  designation1: any;
  salary: string;
  response: any;
  repsonse1: any;
  item;
  Institute;
  careerID;
  CareerLabel;
  constructor(private model:ModalController,navParams: NavParams,public toastmessageService:ToastmessageService,private HttpRequest: HttprequestService, public Ipaddressservice: IpaddressService,private http: HttpClient) {
this.designation1="";
    this.loadDesignation();

    this.item=navParams.get('item');


    if(this.item!=undefined){
      this.tempID = "1";
      this.employer=this.item.Employer;
      this.fromdate=new Date(this.item.From).toISOString().substring(0, 10);;

      this.toDate=new Date(this.item.To).toISOString().substring(0, 10);;
      this.Institute=this.item.Institute;
      this.salary=this.item.Salary;
     this.careerID = this.item.ID;

    //  alert("careerID : "+ this.careerID);
      // $scope.career.ID = value.ID;
      this.CareerLabel = "Update Career";
    }
    else{
      this.designation1="";
      this.tempID = "0";
    }
  }

  ngOnInit() {
  }

  loadDesignation() {


      this.HttpRequest.GetRequest(this.Ipaddressservice.ipaddress1 +this.Ipaddressservice.serviceurlhrms+"/CommonDropdown/" + "Designation"+ "/" + "0/"+"0"+"/0").then(resp=>{
        this.Designationresp = resp;
        if(this.item!=undefined){
          for(var i=0; i<this.Designationresp.length; i++){

            if(this.Designationresp[i].VALUE==this.item.Designation){
              this.designation1= this.Designationresp[i].VALUE;
            }
          }
        }
        console.log(""+JSON.stringify(this.Designationresp));
      }, error => {

      console.log("error : "+JSON.stringify(error));

      });

  }
//addCareerDetails
  saveEmployeeDetails(){

    var id;
      if (this.tempID == "0") {
         id = "0";
        console.log(this.tempID);
      } else {
        id=this.careerID;
      }

 this.addCareerObject = {
        empID: window.localStorage['empid'],
        Type: "CareerDetails",
        Employer: this.employer,
        From: this.fromdate,
        To: this.toDate,
        Designation: this.designation1,
        Salary: this.salary,
        ID: id
      }
console.log(""+JSON.stringify(this.addCareerObject))
      var date = this.fromdate.split('-');
      this.fromdate = date[0]+"-"+date[1];
  var date1 = this.toDate.split('-');
  this.toDate = date1[0]+"-"+date1[1] ;
  var frommonth = this.GetMonth(date[1]);


  this.fromdate = date[0]+"-"+frommonth;
  var tomonth =  this.GetMonth(date1[1]);
  this.toDate = date1[0]+"-"+tomonth;


  this.HttpRequest.GetRequest(this.Ipaddressservice.ipaddress1 +this.Ipaddressservice.serviceurlhrms+"EmployeeUpdate/"+window.localStorage['empid']+'/'+ 'CareerDetails'+"/"+this.addCareerObject.Employer+"/"+this.fromdate+"/"+this.toDate +"/"+this.addCareerObject.Designation+"/"+this.addCareerObject.Salary+"/"+this.addCareerObject.ID+"/"+0+'/'+0).then(resp=>{
    
    console.log(""+JSON.stringify(resp));
    // console.log(""+JSON.parse(resp))
    console.log(""+resp[0]['Column1']);
    console.log(""+resp['Column1']);
    this.response = resp;
    this.repsonse1 = JSON.parse(this.response);

    if(this.repsonse1[0]['Column1']== "Successfully Saved" || this.repsonse1[0]['Column1'] == "Successfully Updated" )
    {
      if (this.tempID == "0") {
        this.toastmessageService.presentAlert1("","Career Added Successfully");
     } else {
      this.toastmessageService.presentAlert1("","Career Updated Successfully");
     }

   this.model.dismiss();
    }
  }, error => {

  console.log("error : "+JSON.stringify(error));
  this.toastmessageService.presentAlert1("","Error updating profile");

  });


  }
  closemodel(){

    this.model.dismiss();
  }
  GetMonth(monthNumber) { //1 = January
    var monthNames = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
    return monthNames[monthNumber - 1];
}
}
