import { Component, OnInit } from '@angular/core';
import {HttprequestService} from '../../service/httprequest.service';
import {IpaddressService} from '../../service/ipaddress.service';
import { Router } from '@angular/router';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from '@ionic-native/file/ngx';
import {ToastmessageService} from '../../service/toastmessage.service';
import { MenuController, IonSlides ,NavController } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { AlertController, LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  myrequest:boolean;
  myattendance:boolean;
  mypayslip:boolean;
  myaction:boolean;
  mytraining:boolean;
  mygreeting:boolean;
  displayUser:any=[];
  Emailid;
  empID;
  photo;
  img;
  error;
  empAllRequests1;
  empAllRequests=[];
  empPayslips=[];
  attendance;
  attendanceList=[];
  empApprovals=[];
  training1;
  training=[];
  userid;
  usertoken;
  token;
  emp_id;
  employName;
  employID;
  Wishes;
  advanceempgreeting1;
  advanceempgreeting=[];
  birthdaydateEmp=[];
  datetoday;
  todaydate;
  doc;
  currentlatlon;
  username = window.localStorage.getItem('TUM_USER_NAME');
  allemp;
  displayEmployee:any=[];
  empid;
  FUNCTION_ID;
  year:any=[];
  month:any=[];
  employee_id;
  yeardata;
  monthdata;
  // attendanceList=[];
  nodata:boolean;
  backButtonSubscription: any;
  // username = window.localStorage.getItem('TUM_USER_NAME');
  constructor(private fileOpener: FileOpener,private androidPermissions: AndroidPermissions,
  public toastmessageService:ToastmessageService,public loadingController:LoadingController,private transfer: FileTransfer, private file: File,private router: Router,private HttpRequest:HttprequestService,public Ipaddressservice:IpaddressService,private  menuCtrl: MenuController,private  navCtrl: NavController,private nativeGeocoder: NativeGeocoder, private geolocation: Geolocation,public alertController: AlertController) {
    // this.menuCtrl.enable(true, 'first');
    this.menuCtrl.enable(true, 'first');
    this.attendance = {};
    this.userid = window.localStorage.TUM_USER_ID;
    this.usertoken = window.localStorage.usertoken;
    this.token = window.localStorage['token'];
    this.emp_id=  window.localStorage['TUM_EMP_CODE'];
    console.log(""+window.localStorage['TUM_EMP_CODE']);
    this.employID = window.localStorage['em_emp_id']
    this.employName = window.localStorage['em_emp_name']
    console.log(""+ this.emp_id+this.userid);
    this.myrequest=false;
console.log(this.token,"token")
console.log(window.localStorage['token'],"token1")
console.log(window.localStorage.token,"token2")
    this.empid=window.localStorage['empid'];
    this.FUNCTION_ID=window.localStorage['FUNCTION_ID'];

    this.employee_id = window.localStorage['em_emp_id'];
    this.yeardata="";
    this.monthdata="";
    this.getEmployeeList();
    this.geYears();
    this.geMonths();
    // this.myRequest();
    this.getEmployeeDetails();
    this.getEmployeeALLRequests();
    this.getEmployeePayslip();
    // this.getAttendance();

    this.getEmployeeApprovals();
    this.getMyTrainings();
    this.getGreetings();

this.backbutton();

  }
  backbutton() {
    console.log('backbutton')
    document.addEventListener("backbutton", async () => {
      console.log('backbutton1' + this.router.url)

      if (this.router.url =='/hrmsdashboard') {

        this.router.navigate(['/hrmsdashboard'])
        var alert1 = await this.alertController.create({

          message: 'Are you sure you want to logout',
          buttons: [
            {
              text: 'No',
              role: 'cancel',

              handler: (blah) => {
                console.log('Confirm Cancel: blah');
              }
            }, {
              text: 'Yes',

              handler: () => {

                var logout_obj = {
                  access_token: localStorage.getItem('token'),
                  userid: localStorage.getItem('TUM_USER_ID'),
                  usertoken: localStorage.getItem('usertoken'),

                };
                this.HttpRequest.PostRequest(this.Ipaddressservice.ipaddress + '/Collections/Collections/logout/', logout_obj).then(resp => {
                   this.router.navigate(['/login']);
                }, error => {
                  this.router.navigate(['/login']);

                });


              }
            }
          ]
        });

        await alert1.present();
      // this.logout();

      }
      else if (this.router.url === '/login') {
        navigator['app'].exitApp();

      }
      else {
        console.log('prevois page' + this.router.url)
     //  this.navCtrl.pop();
      }

    });
  }
  getEmployeeList(){
    var obj = {
       empID: window.localStorage.getItem("EmployeeID"),
       name: window.localStorage.getItem("EmployeeName"),
       code: window.localStorage.getItem("TUM_EMP_CODE"),
       designation: window.localStorage.getItem("EmpDesignation"),
       branch: window.localStorage.getItem("TUM_BRANCH_ID"),
       department: window.localStorage.getItem("EmpDepartment"),
       top: 20,
       increment: 1,
       appURL:"employeelist"
     }
     console.log(obj,'ramiz')
  this.HttpRequest.GetRequest(this.Ipaddressservice.ipaddress1 +this.Ipaddressservice.serviceurlhrms+'/EmployeeSearch/'+ obj.empID + "/" + obj.name + "/" + obj.code + "/" + obj.designation + "/" + obj.branch + "/" + obj.department + "/" + obj.top + "/" + obj.increment + "/" + obj.appURL).then(resp=>{
    this.displayEmployee = JSON.stringify(resp);
   this.displayEmployee = JSON.parse(this.displayEmployee);
   this.displayEmployee = this.displayEmployee[0];

  //  console.log("displayEmployee : "+JSON.stringify(this.displayEmployee));

     }, error => {

     console.log("error : "+JSON.stringify(error));

     });
   }
   geYears(){
     this.HttpRequest.GetRequest(this.Ipaddressservice.ipaddress1 +this.Ipaddressservice.serviceurlhrms+"/CommonDropdown/Year/0/0/0").then(resp=>{
       this.year = resp;

         }, error => {

         console.log("error : "+JSON.stringify(error));

         });
   }
   geMonths(){
     this.HttpRequest.GetRequest(this.Ipaddressservice.ipaddress1 +this.Ipaddressservice.serviceurlhrms+"/CommonDropdown/Month/0/0/0").then(resp=>{
       this.month = resp;

         }, error => {

         console.log("error : "+JSON.stringify(error));

         });
   }

   async presentLoadingWithOptions() {
    const loading = await this.loadingController.create({
      spinner: 'crescent',

      message: 'Please wait...',
      translucent: true,
      cssClass: 'custom-class custom-loading',


    });
    return await loading.present();
  }
  async   loadingdismiss() {

     return await this.loadingController.dismiss();
  }
   getAttendance(){
     this.nodata=false;
     this.presentLoadingWithOptions();
       // console.log(this.attendance.empID);
       if (this.yeardata == undefined) {
         this.yeardata = "0";
       }
       if (this.monthdata == undefined) {
         this.monthdata = "0";
       }
       var obj={
         empID:this.employee_id,
         year:this.yeardata,
         month:this.monthdata

       }
       this.HttpRequest.GetRequest(this.Ipaddressservice.ipaddress1 +this.Ipaddressservice.serviceurlhrms+ "EmployeeDailyAttendance/" + obj.empID + "/" + obj.year + "/" + obj.month + "/1").then(resp=>{

        this.loadingdismiss();
         this.attendanceList = JSON.parse(resp.toString());

         console.log(""+JSON.stringify(this.attendanceList));
         if(this.attendanceList.length==0){
           this.nodata = true;
         }
           for (var i = 0; i < this.attendanceList.length; i++) {
             this.attendanceList[i].TxnDate = this.getDateObj(this.attendanceList[i].TxnDate)
           }
           this.attendanceList = this.attendanceList.sort((a, b) => a.TxnDate - b.TxnDate)
           }, error => {
            this.loadingdismiss();
           console.log(error);
           if(error.status == 400){
             this.nodata = true;
           }

           });
   }

   getDateObj(value){
     var split = value.split("/");
     var date = new Date(split[1] + "/" + split[0] + "/" + split[2]);
     return date;
   }


  myRequest(){
    this.myrequest=true;
    this.mypayslip=false;
    this.myattendance=false;
    this.myaction=false;
    this.mytraining=false;
    this.mygreeting=false;
  }
  ngOnInit() {
    setInterval(() => {
      this.updateLocation();
      }, 20000);
  }
  attendance1(){
    this.myrequest=false;
    this.mypayslip=false;
    this.myaction=false;
    this.myattendance=true;
    this.mytraining=false;
    this.mygreeting=false;
  }
  paylsip(){
    this.myrequest=false;
    this.mypayslip=true;
    this.myaction=false;
    this.myattendance=false;
    this.mytraining=false;
    this.mygreeting=false;
  }
  myAction(){
    this.myrequest=false;
    this.mypayslip=false;
    this.myaction=true;
    this.myattendance=false;
    this.mytraining=false;
    this.mygreeting=false;
  }
  myTraining(){
    this.myrequest=false;
    this.mypayslip=false;
    this.myaction=false;
    this.myattendance=false;
    this.mytraining=true;
    this.mygreeting=false;
  }
  myGreetings(){
    this.myrequest=false;
    this.mypayslip=false;
    this.myaction=false;
    this.myattendance=false;
    this.mytraining=false;
    this.mygreeting=true;
  }
  //Get emeployee detail based on login user id
  //*params="empID,name,code,designation,branch,department,top,increment"
  getEmployeeDetails(){
    var obj = {
      empID: window.localStorage.getItem('EmployeeID'),
      name: window.localStorage.getItem('EmployeeName'),
      code: window.localStorage.getItem("TUM_EMP_CODE"),
      designation: window.localStorage.getItem("EmpDesignation") ,
      branch: window.localStorage.getItem("TUM_BRANCH_ID"),
      department:window.localStorage.getItem("EmpDepartment") ,
      top: 20,
      increment: 1,
      appURL:'employeedetails'
    }


    this.HttpRequest.GetRequest(this.Ipaddressservice.ipaddress1 +this.Ipaddressservice.serviceurlhrms+'/EmployeeSearch/'+ obj.empID + "/" + obj.name + "/" + obj.code + "/" + obj.designation + "/" + obj.branch + "/" + obj.department + "/" + obj.top + "/" + obj.increment + "/" + obj.appURL).then(resp=>{
      this.displayUser = JSON.stringify(resp);
      this.displayUser = JSON.parse(this.displayUser);
      console.log(this.displayUser)

      // console.log("displayUser : "+JSON.stringify(this.displayUser));
          window.localStorage['Emailid']=this.displayUser.Email;
          this.Emailid=window.localStorage['Emailid']
          console.log(window.localStorage['Emailid'],'HAPPY')

          this.displayUser[0].Branch = window.localStorage['TUM_BRANCH_CODE'];
          this.empID = this.displayUser[0].EmployeeID;
          // this.empID = 1;

          window.localStorage['em_emp_id']=this.empID;
          console.log("empid"+ window.localStorage['em_emp_id']);
          window.localStorage['empid']=this.empID;
          console.log("empid"+ window.localStorage['empid']);

          if(this.displayUser[0].Photo){
              this.photo=this.displayUser[0].Photo.split('/');
              this.img=this.photo.length-1;

              // console.log("image")
              this.displayUser[0].Photo ='http://demo.herbieai.com/ssg/uploaddocu/sstpl/'+this.photo[this.img];

            }

          if (this.displayUser.length == 0 || this.displayUser == undefined) {
            this.error = "No data found";
          } else {
            this.error = "";
          }
    }, error => {

    console.log("error : "+JSON.stringify(error));

    });
  }

    //Get emeployee requests based on USER_ID and FUNCTION_ID
  //*params="TUM_USER_ID,FUNCTION_ID"
  getEmployeeALLRequests(){
    this.empAllRequests=[];
      var obj={
          TUM_USER_ID:window.localStorage['TUM_USER_ID'],
          FUNCTION_ID:window.localStorage['FUNCTION_ID']
      }
    this.HttpRequest.GetRequest(this.Ipaddressservice.ipaddress1 +this.Ipaddressservice.serviceurlhrms1+"Boworkflowusersummary/"+ obj.TUM_USER_ID+'/'+obj.FUNCTION_ID).then(resp=>{
      this.empAllRequests1 = JSON.parse(resp.toString());
      console.log(this.empAllRequests1);
      this.empAllRequests = this.empAllRequests1.Table1;
      console.log(this.empAllRequests);
    }, error => {

    console.log("error : "+JSON.stringify(error));

    });
  }
  //Get emeployee payslips based on employee id
  //*params="employee id"
  getEmployeePayslip(){

    this.HttpRequest.GetRequest(this.Ipaddressservice.ipaddress1 +this.Ipaddressservice.serviceurlhrms+'/EmployeePayslip/'+ window.localStorage['TUM_USER_ID']+'/'+'payslip').then(resp=>{
      this.empPayslips = JSON.parse(resp.toString());
      console.log("empPayslips : "+JSON.stringify(this.empPayslips))

      if (this.empPayslips.length == 0 || this.empPayslips == undefined) {
        this.error = "No data found";
      } else {
        this.error = "";
      }
    }, error => {

    console.log("error : "+JSON.stringify(error));

    });
  }


 //Get emeployee attendance based on employee id
  //*params="employee id"
  // getAttendance(){
  //  this.attendance.empID = window.localStorage['em_emp_id'];
  //   if (this.attendance.month == undefined) {
  //    this.attendance.month = "0";
  //    this.attendance.month = new Date().toISOString();
  //   }
  //   if (this.attendance.year == undefined) {
  //    this.attendance.year = "0";
  //   }
  //   this.HttpRequest.GetRequest(this.Ipaddressservice.ipaddress1 +this.Ipaddressservice.serviceurlhrms + "EmployeeDailyAttendance/" + this.attendance.empID + "/" + this.attendance.year + "/" + this.attendance.month + "/1").then(resp=>{
  //     this.attendanceList = JSON.parse(resp.toString());
  //     for (var i = 0; i < this.attendanceList.length; i++) {
  //       this.attendanceList[i].TxnDate = this.getDateObj(this.attendanceList[i].TxnDate)
  //     }
  //     // console.log(this.attendanceList);

  //     if (resp == undefined || resp == '[]') {
  //       this.error = "No data found";
  //     } else {
  //       this.error = "";
  //     }
  //   }, error => {

  //   console.log("error : "+JSON.stringify(error));

  //   });
  // }

//Get emeployee apporovals based on employee id
  //*params="employee id"
  getEmployeeApprovals(){
    this.HttpRequest.GetRequest(this.Ipaddressservice.ipaddress1 + this.Ipaddressservice.serviceurlhrms +"/EmployeeApproval/"+ window.localStorage['EmployeeID']).then(resp=>{
      this.empApprovals = JSON.parse(resp.toString());
          // this.empApprovals = this.empApprovals[0];
          // console.log(this.empApprovals);

          if (this.empApprovals.length == 0 || this.empApprovals == undefined) {
            this.error = "No data found";
          } else {
            this.error = "";
          }
    }, error => {

    console.log("error : "+JSON.stringify(error));

    });
  }

  //Get mytrainings based on userid and and usertoken and access_token
  //*params="userid,usertoken,access_token"
  getMyTrainings(){
    var get_obj={

      userid:parseInt(this.userid),
      usertoken:null,
      access_token:this.token
}

    this.HttpRequest.PostRequest(this.Ipaddressservice.ipaddress +this.Ipaddressservice.serviceurlhrms2+"get_training_details/",get_obj).then(resp=>{
      this.training1=resp;
      this.training1.forEach(element => {
        this.training=element;
  });
    }, error => {

    console.log("error : "+JSON.stringify(error));

    });
  }

  //Get mygreetings based on userid and and usertoken and access_token
  //*params="userid,usertoken,access_token"
  getGreetings(){
    var get_obj={

      userid:parseInt(this.userid),
      usertoken:this.usertoken,
      access_token:this.token
}

    this.HttpRequest.PostRequest(this.Ipaddressservice.ipaddress +this.Ipaddressservice.serviceurlhrms2+"getbirthdaywishesMydesk",get_obj).then(resp=>{
      this.advanceempgreeting1=resp;
      this.advanceempgreeting1.forEach(element => {
        this.advanceempgreeting.push(element);
      });

      this.advanceempgreeting.forEach(element => {
      this.birthdaydateEmp.push({
        date:element.em_emp_dob
      })
      });
        console.log(this.birthdaydateEmp);
        this.datetoday = new Date();
        this.todaydate = this.datetoday;
        console.log(this.todaydate);
        var q = new Date();
        var m = q.getMonth()+1;
        console.log(m); //march 3

        var d = q.getDate();
        console.log(d);    // 5 today
        var y = q.getFullYear();

        var date = new Date(y,m,d);

        // mydate=new Date('2009-03-08');
        this.birthdaydateEmp.forEach(element => {
       var mydate=new Date(element.date);

        var m1= mydate.getMonth()+1;
        console.log(m1); // march 3
        var d1 = mydate.getDate();
        console.log(d1); //4  birthday
        console.log(date);   //today date

        console.log(mydate) //birthdate

        if(m>m1)
        {

        }
        else if(m == m1)
        {

          if(parseInt(d.toString())<parseInt(d1.toString())){

            this.advanceempgreeting.forEach(element => {

              element.Wishes='Happy Birthday'
            });


          }
          else if(parseInt(d.toString())>parseInt(d1.toString())){
            this.advanceempgreeting.forEach(element => {

              element.Wishes='Happy Birthday'
            });

          }

          else{
            this.advanceempgreeting.forEach(element => {

              element.Wishes='Happy Birthday'
            });

          }
          console.log(""+JSON.stringify(this.advanceempgreeting));

        }
        else
        {

        }
      });
    }, error => {

    console.log("error : "+JSON.stringify(error));

    });
  }

  //Date conversion format 'dd/mm/yyyy'
  // getDateObj(value) {
  //   var split = value.split("/");
  //   var date = new Date(split[1] + "/" + split[0] + "/" + split[2]);
  //   return date;
  // }

  //go to my approval page
  viewModal(item){
    this.router.navigate(['/hrmsmyapprovals', {
      item:JSON.stringify(item)

      }])
  }

  // downloadDoc(doc) {
  //   console.log(""+doc);
  //   const fileTransfer: FileTransferObject = this.transfer.create();

  //   const url = 'http://www.pdf995.com/samples/pdf.pdf';
  //   fileTransfer.download(url, this.file.dataDirectory + 'file.pdf').then((entry) => {
  //   this.toastmessageService.presentAlert1("Success","Downloaded Successfully");
  //   }, (error) => {
  //     this.toastmessageService.presentAlert1("error","File not found");
  //   });
  //  }

  getPermission(url) {
  this.androidPermissions.hasPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
      .then(status => {
        if (status.hasPermission) {
          this.downloadFile(url, '.pdf');
        }
        else {
          this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE)
            .then(status => {
              if (status.hasPermission) {
                this.downloadFile(url, '.pdf');
              }
            });
        }
      });
  }
  downloadFile(url, fileName) {

    const fileTransfer: FileTransferObject = this.transfer.create();

    fileTransfer.download(url, this.file.externalRootDirectory +
      '/Download/' + fileName).then()
    let fileExtn = fileName.split('.').reverse()[0];
    let fileMIMEType = this.getMIMEtype(fileExtn);
    this.fileOpener.open("file:///storage/emulated/0/download/" + fileName + "", fileMIMEType)
      .then(() => console.log('File is opened'))
      .catch(e => console.log('Error openening file', e));


  }
  getMIMEtype(extn) {
    let ext = extn.toLowerCase();
    let MIMETypes = {
      'txt': 'text/plain',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'doc': 'application/msword',
      'pdf': 'application/pdf',
      'jpg': 'image/jpeg',
      'bmp': 'image/bmp',
      'png': 'image/png',
      'xls': 'application/vnd.ms-excel',
      'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'rtf': 'application/rtf',
      'ppt': 'application/vnd.ms-powerpoint',
      'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation'
    }
    return MIMETypes[ext];
  }
   downloadDoc(url1) {

    var url="http://www.africau.edu/images/default/sample.pdf";
    const fileTransfer: FileTransferObject = this.transfer.create();
    var file = url.split('/');
    var fileName = file[file.length - 1];
    fileTransfer.download(url, this.file.externalRootDirectory +
      '/Download/' + fileName).then(() =>
      this.toastmessageService.presentAlert1("Downloaded Successfully","Please check the Downloads folder")
       )

  }

  updateLocation(){
    this.geolocation.getCurrentPosition().then((res) => {

      this.currentlatlon = res.coords.latitude + "," + res.coords.longitude;
      let location = 'lat ' + res.coords.latitude + ' lang ' + res.coords.longitude;
      console.log("location :n" + location);
      var input_obj = {
        'TUM_USER_CODE': window.localStorage['TUM_USER_CODE'],
        'current_location': this.currentlatlon,
      userid:window.localStorage['TUM_USER_ID'],
      usertoken:window.localStorage['usertoken'],
        access_token:window.localStorage['token'] };

        this.HttpRequest.PostRequest(this.Ipaddressservice.ipaddress +this.Ipaddressservice.serviceurlhrms2+"update_current_location",input_obj).then(resp=>{

          console.log(resp);
        }, error => {

        //console.log("error : "+JSON.stringify(error));

        });
    }).catch((error) => {
      // this.presentAlert('', 'Turn on location to processed!');
    });
  }

  async presentAlert(heading, tittle) {
    var alert = await this.alertController.create({
      header: heading,

      message: tittle,
      buttons: ['OK']
    });

    await alert.present();
  }
}
