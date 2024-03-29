import { Component, OnInit } from '@angular/core';
import { HttprequestService } from '../../service/httprequest.service';
import { IpaddressService } from '../../service/ipaddress.service';
import {ToastmessageService} from '../../service/toastmessage.service';
import { DatePipe } from '@angular/common';
import { Router,ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-permission-request',
  templateUrl: './permission-request.page.html',
  styleUrls: ['./permission-request.page.scss'],
})
export class PermissionRequestPage implements OnInit {
  permDate;
  fromHour;
  toHour;
  contact;
  reqID;
  userID;
  empID;
  status;
  reason;
  workflowTable;
  reqtype;
  usertoken;
  name;
  company;
  branch;
  department;
  empCode;
  urldata;
  permissiondata;
  reqdate;
  BETWEEN;
  Status;
  dat_valid;
  reqID2: any;
  disabledvalue;
  rreqid3: any;
  permissiontaken: any;
  time: any;
  release=false;
  currentstatus;
  username = window.localStorage.getItem('TUM_USER_NAME');
  constructor(private router: Router,private route:ActivatedRoute,private datepipe: DatePipe,private HttpRequest: HttprequestService, public Ipaddressservice: IpaddressService,public toastmessageService:ToastmessageService) {
    this.status = "P";
    this.userID=window.localStorage['TUM_USER_ID'];
    this.empCode= window.localStorage['TUM_EMP_CODE'];
    this.empID=window.localStorage['empid'];
    this.usertoken = window.localStorage['usertoken'];
    this.disabledvalue = false;
this.getEmployeeDetails();
this.dat_valid= {
  currentDate: new Date()
};

this.urldata = this.route.params.subscribe(params => {
  this.permissiondata=JSON.parse(params.item);
  if(this.permissiondata!=undefined){

    this.reqID2=this.permissiondata.Txnreference;
    this.reqdate=this.permissiondata.Requesteddate;

    this.permDate=this.permissiondata.Permissiondate;
    this.permDate=this.permissiondata.Permissiondate.split('/');
    this.permDate=this.permDate[2]+'-'+this.permDate[1]+'-'+this.permDate[0]
    this.BETWEEN=this.permissiondata.Between;
    this.time = this.permissiondata.Between.split('-');
console.log(""+this.time[0]+""+this.time[1]);
this.fromHour = this.time[0];
this.toHour = this.time[1];
    this.reason=this.permissiondata.Reason;
    this.Status=this.permissiondata.Status;
    this.permissiontaken =this.permissiondata.Permissionstaken
    this.currentstatus = this.permissiondata.Currentstatus;
    // this.workflow_no=this.permissiondata.workflow_no;
    this.disabledvalue = true;
  }
});
    }

  ngOnInit() {
  }
  permissionSubmit(){
    if(this.release ==true)
     {
      this.status= 'P';
     }
     else{
      this.status= 'N';
     }

    var date = new Date();
     date = this.formatDate(date);
    var permDate = this.formatDate(this.permDate);

    var fmhour=this.fromHour.split(":")
    var fromHour =fmhour[0] + "@" + fmhour[1];

    var thour=this.toHour.split(":")
    var toHour =thour[0] + "@" + thour[1];
   if(fromHour==toHour){
    this.toastmessageService.presentAlert1("","From hour and to hour should not be same");
   }
   else{
    if (this.contact == undefined) {
      this.contact = null;
    }
    // this.reqID = "@";
    this.reqID = " ";
    // this.perm.status = "N";
    this.userID = this.userID;

var perm={
  contact:this.contact,
  reqID:this.reqID,
  userID:this.userID,
  empID:this.empID,
  status:this.status
}

   this.HttpRequest.GetRequest(this.Ipaddressservice.ipaddress1 +this.Ipaddressservice.serviceurlhrms+"SavePermission/" + window.localStorage['FUNCTION_ID'] + "/" + perm.empID + "/" + perm.reqID + "/" + date + "/" + permDate + "/" + fromHour + "/" + toHour + "/" + this.contact + "/" + this.reason + "/" + this.status).then(resp=>{

    if (resp == '"Permission is not enabled for this Employee"') {
      // console.log("Gotcha : " + resp);
      this.toastmessageService.presentAlert1("Request Not Sent","Permission is not enabled for this Employee");


    }
    else if (resp == '"Coff already available for this date"') {
      this.toastmessageService.presentAlert1("Request Not Sent","Coff already available for this date");

    }
     else if (resp == '"No of permissions for the requested month are already taken"') {
      this.toastmessageService.presentAlert1("Request Not Sent","No of permissions for the requested month are already taken");

    } else if (resp == '"Permission not available for Weekoff/Holiday"') {
      this.toastmessageService.presentAlert1("Request Not Sent","Permission not available for Weekoff/Holiday");


    }
    else if(resp=='"Permission is limited to 1 hour per day'){
      this.toastmessageService.presentAlert1("Request Not Sent","Permission is limited to 1 hour per day");
    }
     else if (resp == '"Permission already available for this date"') {
      this.toastmessageService.presentAlert1("Request Not Sent","Permission already available for this date");
 } else if (resp == '"Permission duration exceeds the applicable limit"') {
  this.toastmessageService.presentAlert1("Request Not Sent","Permission duration exceeds the applicable limit");

    } else {
      //IF ATTENDANCE IS PRESENT

      var replace = resp.toString().replace(/"/g, '');
      var split = replace.split("@");
      this.rreqid3 = split[0];
      // console.log(""+this.reqID);
      this.reqID2 = this.rreqid3.split(',');
      this.reqID= this.reqID2[1];
      // console.log(""+ this.rreqid3+""+ this.reqID2)
      this.workflowTable = split[3];
      this.userID = this.userID;
      // console.log(split[2]);
      this.reqtype = 'null';
      if (split[2] == "Permission Saved Successfully") {
        this.toastmessageService.presentAlert1("Request Sent","Request saved Successfully <br> Req Ref : " + this.reqID2);

        if (this.status == "P") {

          this.HttpRequest.GetRequest(this.Ipaddressservice.ipaddress1 +this.Ipaddressservice.serviceurlhrms1+"WorkFlowAuth/"+ split[1] + "/" + this.reqtype + "/null/null/" + this.userID + "/1/" + this.workflowTable).then(resp=>{
            if (resp == "1") {
              console.log("Workflow called successfully :" + resp);

            } else {
              // console.log("Workflow not called:" + resp);
            }
          }, error => {

          console.log("error : "+JSON.stringify(error));

          });
        }
        var typerequest = "Permission Request"
        // var perdate = $filter('date')(this.perm.permDate, "yyyy-MM-dd");
        var fromhour =this.datepipe.transform(this.fromHour,"hh:mm a")

        var tohour = this.datepipe.transform(this.toHour,"hh:mm a")

        var reportobj = {
          Userid:this.userID,
          from: fromhour,
          to: tohour,
          typerequest: typerequest,
          userid:this.userID,
          usertoken:this.usertoken,
          access_token: window.localStorage.token
        }

        this.HttpRequest.PostRequest(this.Ipaddressservice.ipaddress +this.Ipaddressservice.serviceurlhrms2+"getreportingto/",reportobj).then(resp=>{

        }, error => {

        console.log("error : "+JSON.stringify(error));

        });


      }
    }
     }, error => {

     console.log("error : "+JSON.stringify(error));

     });
     this.permCancel();
    }
  }

  getEmployeeDetails(){
    this.HttpRequest.GetRequest(this.Ipaddressservice.ipaddress1 +this.Ipaddressservice.serviceurlhrms+"/GetEmployees/"+this.empCode).then(resp=>{
      if (resp == "Employee not Exist") {
  this.toastmessageService.presentAlert1("","Employee Does not Exist");

      } else {
          this.status = "P";
          this.name = window.localStorage['TUM_USER_NAME'];

          this.company = window.localStorage['FUNCTION_DESC'];
          this.branch=window.localStorage['TUM_BRANCH_CODE']
       var employeeDetails = JSON.parse(resp.toString());
debugger
        this.department = employeeDetails[0].Department;
        console.log('this.department ',this.department);

        this.empID = employeeDetails[0].EmpID;

        // this.userID = employeeDetails[0].UserID;
        this.contact = employeeDetails[0].ContactPhone;

      }
     }, error => {

     console.log("error : "+JSON.stringify(error));

     });
  }

  formatDate(value) {
    value = new Date(value);

    var day = value.getDate();
    if (day < 10) {
      day = "0" + day;
    }
    var month = value.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
      // console.log(month);
    }
    var year = value.getFullYear();
    value = day + "-" + month + "-" + year;
    return value;
  }
  formatTime(value) {
    alert("value"+value);
    if (value != null && value!=undefined) {
      var hour = value.getHours();
      var minute = value.getMinutes();
      value = hour + "@" + minute;
      return value;
    }
  }
  permissionList(){
    this.router.navigateByUrl('/hrmspermissionsummary');
  }

  permCancel(){
    this.permDate=undefined;
    this.fromHour=undefined;
    this.toHour=undefined;
this.reason=undefined;
  }

}
