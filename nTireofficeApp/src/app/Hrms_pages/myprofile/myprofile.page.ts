import { Component, OnInit} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttprequestService } from '../../service/httprequest.service';
import { IpaddressService } from '../../service/ipaddress.service';
import { AlertController } from '@ionic/angular';
import { validateemail } from '../../../assets/validation.js';
import { DatePipe } from '@angular/common';
import {ToastmessageService} from '../../service/toastmessage.service';
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';
import { ModalController } from '@ionic/angular';
import * as $ from 'jquery';
import { Crop } from '@ionic-native/crop/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import {ApplicanteducationdetailPage} from '../applicanteducationdetail/applicanteducationdetail.page';
// import {DenyScreenPage} from '../deny-screen/deny-screen.page';
import {ApplicantemploymentdetailsPage} from '../applicantemploymentdetails/applicantemploymentdetails.page';
import{OpenAddEducationPage} from'../open-add-education/open-add-education.page';
import{OpenaddemploymentpagePage} from'../openaddemploymentpage/openaddemploymentpage.page';
import { ActionSheetController } from '@ionic/angular';
import { data } from 'jquery';

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.page.html',
  styleUrls: ['./myprofile.page.scss'],
  providers:[Camera]
})
export class MyprofilePage implements OnInit {
  emp_id;
  private optionsCamera: CameraOptions = {
    quality: 100,
    targetWidth: 600,
    sourceType: this.camera.PictureSourceType.CAMERA,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    correctOrientation: true //Corrects Android orientation quirks
  }
  validemail: boolean;
  profile1=[];
  image;
  Images=[];
  file;
  photo;
  img;
  qualification:any=[];
  // file=[];
  subQualification:any=[];
  profile={
    Qualification:"",
    DOB:'',
    emp_qualification:"",
    FirstName:"",
    LastName:"",
    CurrentAddress:"",
    CurrentCity:"",
    CurrentState:"",
    CurrentCountry:"",
    CurrentPincode:"",
    PermanentAddress:"",
    PermanentCity:"",
    PermanentState:"",
    PermanentCountry:"",
    PermanentPincode:"",
    Email:"",
    EmergencyContactNumber:"",
    Mobile:0,
    EmergencyContactName:"",
    emp_subqualification:"",

  }
   emp={
    qualification:"",
    subQualification:"",
  }
  PermanentAddressObject;
  personalToggle;
  currentToggle;
  permanentToggle;
  contactToggle;
  personalDetailsObject;
  currentAddressObject;
  ContactDetailsObject;
  error;
  EducationDetails:any=[];
  CareerDetails:any=[];
  segmentdata;
  dat_valid: { currentDate: Date; };
  validphone: boolean;
  imagecif: number;
  profilepic: string;Personal
  tempID: string;
  public buttonClicked: boolean = false;
  username = window.localStorage.getItem('TUM_USER_NAME');
  empID: any;
  constructor( public modalController: ModalController,public alertController: AlertController,
    public toastmessageService:ToastmessageService,private datepipe: DatePipe,public sanitizer: DomSanitizer,private base64: Base64,private crop: Crop,private camera: Camera,private HttpRequest: HttprequestService, public Ipaddressservice: IpaddressService,private http: HttpClient,public actionSheetController: ActionSheetController) {
    this.emp_id=  window.localStorage['TUM_EMP_CODE'];
    console.log(""+this.emp_id)
   this.personalToggle = 0;
   this.currentToggle = 0;
   this.permanentToggle = 0;
   this.contactToggle = 0;
   this.segmentdata="Personal";
   this.dat_valid= {
    currentDate: new Date()
  };
    this.getEmployeeDetails();
    this.getQualification();

    this.getEducationDaetails();
    this.getcarrierDaetails();
  }

  ngOnInit() {
  }
 //Get emeployee detail based on login user id
  //*params="empID,name,code,designation,branch,department,top,increment"

  // phonenumber(inputtxt) {
  //   var mob = /^[1-9]{1}[0-9]{9}$/;
  //   var currentValue = $("#inputMobile").val();
  //   if (mob.test(currentValue) == false && currentValue != 10) {
  //     this.validphone = true;
  //   } else {
  //     this.validphone = false;
  //   }
  //   event.preventDefault();
  // }



  //camera and Gallery

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Albums',
      buttons: [ {
        text: 'Camera',
        icon: 'camera',
        handler: () => {
          console.log('Share clicked');
          this.imagecif = Math.floor((Math.random() * 1000000000000000) + 1);
          const options: CameraOptions = {
            quality: 100,
           sourceType: this.camera.PictureSourceType.CAMERA,
            destinationType: this.camera.DestinationType.FILE_URI,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            correctOrientation: true //Corrects Android orientation quirks
          }

          this.camera.getPicture(options).then((imageData) => {
            // imageData is either a base64 encoded string or a file URI
            // If it's base64:

            this.crop.crop(imageData, { quality: 100 })
              .then(
                newImage => {

                  this.base64.encodeFile(newImage).then((base64File: string) => {
                    var base64result = base64File.split(',')[1]

                    this.profilepic = "data:image/jpeg;base64," + base64result;
                    this.image = "Profile"+this.imagecif + ".jpg";

                    // console.log(this.image);
                    this.file = this.dataURLtoFile(this.profilepic, this.image);
                    var imageobj={
                      em_emp_photo:this.image,
                      EM_EMP_CODE:window.localStorage['TUM_EMP_CODE'],
                      userid:window.localStorage['TUM_USER_ID'],
                      usertoken:window.localStorage['usertoken'],
                      access_token:window.localStorage['token']
                     }

                     this.HttpRequest.PostRequest("http://demo.herbieai.com:8033/dms/DMS/cams_hrms_sales/upload_profileImageHRMS/",imageobj).then(resp=>{

                      console.log(""+JSON.stringify(this.qualification))
                    }, error => {

                    console.log("error : "+JSON.stringify(error));

                    });
      console.log(""+this.profilepic+""+this.image)
      // alert("blob"+this.profilepic+""+this.image)
                    var url =this.Ipaddressservice.ipaddress+'/dms/uploadprofileImg';
                 const formData: any = new FormData();
                 formData.append("upload", this.file,this.image);

                 console.log('form data variable :   '+ formData.toString());
                 this.http.post(url, formData)

                     .subscribe(files => console.log('files', files))



                  }, (err) => {
                    console.log(err);
                  });

                },
                error => {
                  console.error('Error cropping image', error);
                }
              );

          }, (err) => {
            // Handle error
          })
        }
      },  {
        text: 'Gallery',
        icon: 'camera',
        handler: () => {
          console.log('Favorite clicked');
          this.imagecif = Math.floor((Math.random() * 1000000000000000) + 1);
    const options: CameraOptions = {
      quality: 100,
     sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true //Corrects Android orientation quirks
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:

      this.crop.crop(imageData, { quality: 100 })
        .then(
          newImage => {

            this.base64.encodeFile(newImage).then((base64File: string) => {
              var base64result = base64File.split(',')[1]

              this.profilepic = "data:image/jpeg;base64," + base64result;
              this.image = "Profile"+this.imagecif + ".jpg";

              // console.log(this.image);
              this.file = this.dataURLtoFile(this.profilepic, this.image);
              var imageobj={
                em_emp_photo:this.image,
                EM_EMP_CODE:window.localStorage['TUM_EMP_CODE'],
                userid:window.localStorage['TUM_USER_ID'],
                usertoken:window.localStorage['usertoken'],
                access_token:window.localStorage['token']
               }

               this.HttpRequest.PostRequest("http://demo.herbieai.com:8033/dms/DMS/cams_hrms_sales/upload_profileImageHRMS/",imageobj).then(resp=>{

                console.log(""+JSON.stringify(this.qualification))
              }, error => {

              console.log("error : "+JSON.stringify(error));

              });
console.log(""+this.profilepic+""+this.image)
// alert("blob"+this.profilepic+""+this.image)
              var url =this.Ipaddressservice.ipaddress+'/dms/uploadprofileImg';
           const formData: any = new FormData();
           formData.append("upload", this.file,this.image);

           console.log('form data variable :   '+ formData.toString());
           this.http.post(url, formData)

               .subscribe(files => console.log('files', files))



            }, (err) => {
              console.log(err);
            });

          },
          error => {
            console.error('Error cropping image', error);
          }
        );

    }, (err) => {
      // Handle error
    })
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }


  getEmployeeDetails(){
    var obj = {
      empID: 0,
      name: window.localStorage.getItem("EmployeeName"),
      code: window.localStorage.getItem("TUM_EMP_CODE"),
      designation: window.localStorage.getItem("EmpDesignation"),
      branch: window.localStorage.getItem("TUM_BRANCH_ID"),
      department: window.localStorage.getItem("EmpDepartment"),
      top: 20,
      increment: 1,
      appURL:'employeedetails'
    }
    console.log(""+obj)
    this.HttpRequest.GetRequest(this.Ipaddressservice.ipaddress1 +this.Ipaddressservice.serviceurlhrms+'/EmployeeSearch/'+ obj.empID + "/" + obj.name + "/" + obj.code + "/" + obj.designation + "/" + obj.branch + "/" + obj.department + "/" + obj.top + "/" + obj.increment+"/"+obj.appURL).then(resp=>{
      this.profile = JSON.parse(resp.toString());
      this.profile1 = JSON.parse(resp.toString());
      console.log((resp));

      window.localStorage['em_emp_id']=this.empID;
      console.log("empid"+ window.localStorage['em_emp_id']);
      window.localStorage['empid']=this.empID;
      console.log("empid"+ window.localStorage['empid']);
        if(this.profile1[0].Photo){
          this.photo=this.profile1[0].Photo.split('/');
          console.log(""+this.photo);
          this.img=this.photo.length-1;
          console.log(""+this.img);

          console.log("image")
          // this.profile1[0].Photo ='http://192.168.0.50/mydesk/SmartHRMS/Upload/'+this.photo[this.img];


          // this.profile1[0].Photo ='http://192.168.0.6/mydesk/SmartHRMS/Upload/'+this.photo[this.img];
          this.profile1[0].Photo ='http://demo.herbieai.com/ssg/uploaddocu/sstpl/'+this.photo[this.img];
// this.profilepic ='https://herbieai.com/mydesk/Uploaddocu/SSTPL/'+this.photo[this.img];
          this.profilepic ='http://demo.herbieai.com/ssg/uploaddocu/sstpl/'+this.photo[this.img];

// https://sunsmart.in/mydesk/Uploaddocu/
          this.profile[0].Photo='https://herbieai.com/mydesk/Uploaddocu/SSTPL/'+this.photo[this.img];

        }

      this.profile = this.profile[0];
      console.log(this.profile);
      console.log(this.profile['CurrentCountry'])
      this.profile.Mobile = this.profile.Mobile;

    }, error => {

    console.log("error : "+JSON.stringify(error));

    });
  }
  Attachdocument(){
  this.imagecif = Math.floor((Math.random() * 1000000000000000) + 1);
    const options: CameraOptions = {
      quality: 100,
     sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true //Corrects Android orientation quirks
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:

      this.crop.crop(imageData, { quality: 100 })
        .then(
          newImage => {

            this.base64.encodeFile(newImage).then((base64File: string) => {
              var base64result = base64File.split(',')[1]

              this.profilepic = "data:image/jpeg;base64," + base64result;
              this.image = "Profile"+this.imagecif + ".jpg";

              // console.log(this.image);
              this.file = this.dataURLtoFile(this.profilepic, this.image);
              var imageobj={
                em_emp_photo:this.image,
                EM_EMP_CODE:window.localStorage['TUM_EMP_CODE'],
                userid:window.localStorage['TUM_USER_ID'],
                usertoken:window.localStorage['usertoken'],
                access_token:window.localStorage['token']
               }

               this.HttpRequest.PostRequest("http://demo.herbieai.com:8033/dms/DMS/cams_hrms_sales/upload_profileImageHRMS/",imageobj).then(resp=>{

                console.log(""+JSON.stringify(this.qualification))
              }, error => {

              console.log("error : "+JSON.stringify(error));

              });
console.log(""+this.profilepic+""+this.image)
// alert("blob"+this.profilepic+""+this.image)
              var url =this.Ipaddressservice.ipaddress+'/dms/uploadprofileImg';
           const formData: any = new FormData();
           formData.append("upload", this.file,this.image);

           console.log('form data variable :   '+ formData.toString());
           this.http.post(url, formData)

               .subscribe(files => console.log('files', files))



            }, (err) => {
              console.log(err);
            });

          },
          error => {
            console.error('Error cropping image', error);
          }
        );

    }, (err) => {
      // Handle error
    })
  }

  dataURLtoFile(dataURI, filename) {
    console.log(dataURI)
    console.log(filename)

    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for(var i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
    }

    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
    };
  getQualification(){
    this.HttpRequest.GetRequest(this.Ipaddressservice.ipaddress1 +this.Ipaddressservice.serviceurlhrms+"/CommonDropdown/Qualification/" + "0" + "/0/0").then(resp=>{
      this.qualification =resp;
      // this.getSubQualification(this.emp.qualification);
    }, error => {

    console.log("error : "+JSON.stringify(error));

    });
  }

  getSubQualification(data){

    this.HttpRequest.GetRequest(this.Ipaddressservice.ipaddress1 +this.Ipaddressservice.serviceurlhrms+"/CommonDropdown/SubQualification/"+ "0/"+data+"/0").then(resp=>{
      this.subQualification = resp;
    }, error => {

    console.log("error : "+JSON.stringify(error));

    });
  }

  getEducationDaetails(){

    this.HttpRequest.GetRequest(this.Ipaddressservice.ipaddress1 +this.Ipaddressservice.serviceurlhrms+"/CommonDropdown/EducationDetails/" +"0/"+ data+ "/0").then(resp=>{
      this.EducationDetails = resp;
    }, error => {

    console.log("error : "+JSON.stringify(error));

    });
  }
  getcarrierDaetails(){
    this.HttpRequest.GetRequest(this.Ipaddressservice.ipaddress1 +this.Ipaddressservice.serviceurlhrms+ "/CommonDropdown/CareerDetails/" +"0/"+ data+ "/0").then(resp=>{
      this.CareerDetails = resp;
    }, error => {

    console.log("error : "+JSON.stringify(error));

    });
  }
  sameAsCurrent() {
    this.buttonClicked = !this.buttonClicked;

    if(this.buttonClicked == true)
    {


      this.profile.PermanentAddress = this.profile.CurrentAddress;
      this.profile.PermanentCity = this.profile.CurrentCity;
      this.profile.PermanentState = this.profile.CurrentState;
      this.profile.PermanentCountry = this.profile.CurrentCountry;
      this.profile.PermanentPincode = this.profile.CurrentPincode;

    }
    else{

      this.profile.PermanentAddress = '';
      this.profile.PermanentCity = '';
      this.profile.PermanentState = '';
      this.profile.PermanentCountry = '';
      this.profile.PermanentPincode = '';


  }
}

// emailnumbaervalid(email) {
//     var regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
//     if(!regex.test(email)) {
//       return false;
//     }else{
//       return true;
//     }
//   }


  emailnumbaervalid(event) {
    var emailcheck = validateemail(event.target.value);
    if (emailcheck == false) {
      this.validemail = true;
    }
    else {
      this.validemail = false;
    }
  }

  async updateEducationModal(value){
    console.log(""+JSON.stringify(value));
    this.tempID = "1";
    const modal = await this.modalController.create({
      component: OpenAddEducationPage,
      componentProps: {
        'item':value,
        'item2':this.tempID ,

      }

    });
    modal.onDidDismiss()
    .then((data) => {
      this.getEducationDaetails();
  });

    return await modal.present();

  }

  async updateCareerModal(value){

    this.tempID = "0";
    const modal = await this.modalController.create({
      component: OpenaddemploymentpagePage,
      componentProps: {
        'item':value,
        'item1': this.tempID,

      }

    });
    modal.onDidDismiss()
    .then((data) => {
      this.getcarrierDaetails();
  });
  return await modal.present();
  }

  async addCareerModal(){

    const modal = await this.modalController.create({
      component: OpenaddemploymentpagePage


    });
    modal.onDidDismiss()
    .then((data) => {
      this.getcarrierDaetails();
  });
  return await modal.present();
  }


  async addEducationModal(value){

    const modal = await this.modalController.create({
      component: OpenAddEducationPage,
      componentProps: {
        'item':value,

      }

    });
    modal.onDidDismiss()
    .then((data) => {
      this.getEducationDaetails();
  });

    return await modal.present();

  }


    async deleteEducationDetail(value){
      const alert = await this.alertController.create({

        message: 'Do you want to Delete?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            }
          }, {
            text: 'Yes',
            handler: () => {
           var deleteObj = {
                ID: value,
                Type: "EducationDetails",
                empID: window.localStorage['empid']
              };
              this.HttpRequest.GetRequest(this.Ipaddressservice.ipaddress1+this.Ipaddressservice.serviceurlhrms+"EmployeeDetailsDelete/" + deleteObj.empID + "/" + deleteObj.Type + "/" + deleteObj.ID + "/0").then(resp=>{
                this.toastmessageService.presentAlert1("","Education Details Removed");
                this.getEducationDaetails();
              }, error => {

              console.log("error : "+JSON.stringify(error));

              });
            }
          }
        ]
      });

      await alert.present();
    }

   async deleteCareerDetail(value){
      const alert = await this.alertController.create({

        message: 'Do you want to Delete?',
        buttons: [
          {
            text: 'No',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            }
          }, {
            text: 'Yes',
            handler: () => {
           var deleteObj = {
                ID: value,
                Type: "CareerDetails",
                empID: window.localStorage['empid']
              };
              this.HttpRequest.GetRequest(this.Ipaddressservice.ipaddress1+this.Ipaddressservice.serviceurlhrms+"EmployeeDetailsDelete/" + deleteObj.empID + "/" + deleteObj.Type + "/" + deleteObj.ID + "/0").then(resp=>{
                this.toastmessageService.presentAlert1("","Career Details Removed");
                this.getcarrierDaetails();
              }, error => {

              console.log("error : "+JSON.stringify(error));

              });
            }
          }
        ]
      });

      await alert.present();
    }

  hidePersonalPanel(value){
    console.log(value);

        // PERSONAL CONDITIONS
        if (value == "personal") {
          if (this.personalToggle == 0) {
            this.personalToggle = 1;
            // this.profile.DOB = $filter('date')(new Date(this.profile.DOB), "MM-dd-yyyy");
            this.profile.DOB = this.datepipe.transform(this.profile.DOB,"MM-dd-yyyy")
            console.log(this.profile.DOB)
            console.log(Date.parse(this.profile.DOB))
            if(this.profile.DOB)
            {
              var date=new Date(this.profile.DOB);
              var splitfirst=date.toLocaleDateString().split('/');

              console.log(splitfirst)
              if(Number(splitfirst[0])<10){
                splitfirst[0] = '0'+String(splitfirst[0]);
              }
              this.profile.DOB=splitfirst[2]+'-'+splitfirst[0]+'-'+splitfirst[1];
              console.log(""+this.profile.DOB)
            }
            var indexval=this.qualification.findIndex(x => x.VALUE == this.profile.emp_qualification)
            this.emp.qualification=this.qualification[indexval].VALUE

            this.HttpRequest.GetRequest(this.Ipaddressservice.ipaddress1 +this.Ipaddressservice.serviceurlhrms+"CommonDropdown/"+ window.localStorage['FUNCTION_ID']+  "/" + "SubQualification"+ "/" + "0/"+this.qualification[indexval].VALUE+"/0").then(resp=>{
              this.subQualification = JSON.parse(resp.toString());
              var indexval1=this.subQualification.findIndex(x => x.VALUE == this.profile.emp_subqualification)

              this.emp.subQualification=this.subQualification[indexval1].VALUE
              console.log(""+this.emp.subQualification);
            }, error => {

            console.log("error : "+JSON.stringify(error));

            });


          } else {
            // debugger;
            this.personalToggle = 0;
            // console.log("Update");

            if(this.profile.FirstName == undefined || this.profile.FirstName == null || this.profile.FirstName == '')
            {
              this.profile.FirstName = ' ';
            }
            if(this.profile.LastName == undefined || this.profile.LastName == null || this.profile.LastName == '')
            {
              this.profile.LastName = ' ';
            }
            if(this.profile.DOB == undefined || this.profile.DOB == null || this.profile.DOB == '')
            {
              this.profile.DOB = ' ';
            }
            if(this.emp.qualification == undefined || this.emp.qualification == null || this.emp.qualification == '')
            {
              this.emp.qualification = ' ';
            }
            if(this.emp.subQualification == undefined || this.emp.subQualification == null || this.emp.subQualification == '')
            {
              this.emp.subQualification = ' ';
            }
     var dob = this.datepipe.transform(this.profile.DOB,"MM-dd-yyyy")

            this.personalDetailsObject = {
              empID: window.localStorage['empid'],
              Type: "PersonalDetails",
              FirstName: this.profile.FirstName,
              LastName: this.profile.LastName,
              DOB: dob,
              Qualification: this.emp.qualification,
              SubQualification: this.emp.subQualification
            };
            console.log(this.personalDetailsObject)

            this.HttpRequest.GetRequest(this.Ipaddressservice.ipaddress1 +this.Ipaddressservice.serviceurlhrms+ "EmployeeUpdate/" + this.personalDetailsObject.empID + "/" + this.personalDetailsObject.Type + "/" + this.personalDetailsObject.FirstName + "/" + this.personalDetailsObject.LastName + "/" + this.personalDetailsObject.DOB + "/" + this.personalDetailsObject.Qualification + "/" + this.personalDetailsObject.SubQualification + "/null/null/null").then(resp=>{
              var data = JSON.parse(resp.toString());

                if (data[0].Column1 == "Successfully Updated") {
                  // Store the Data and Display the success message to user
                  this.error = "";

                alert('Personal Details Updated');

                  this.getEmployeeDetails();

                } else {
                  this.error = "Error Updating Profile";
                  alert('Error Updating Profile');
                }
            }, error => {

            console.log("error : "+JSON.stringify(error));

            });

          }
        } else if (value == "personal.cancel") {
          this.personalToggle = 0;
          this.getEmployeeDetails();
        }

        //CURRENT CONDITIONS
        if (value == "current") {
          if (this.currentToggle == 0) {
            this.currentToggle = 1;
            // console.log("Edit");
          } else {
            this.currentToggle = 0;
            // console.log("Update");


             if(this.profile.CurrentAddress == undefined || this.profile.CurrentAddress == null || this.profile.CurrentAddress == '')
            {
              this.profile.CurrentAddress = ' ';
            }
             if(this.profile.CurrentCity == undefined || this.profile.CurrentCity == null || this.profile.CurrentCity == '')
            {
              this.profile.CurrentCity = ' ';
            }
             if(this.profile.CurrentState == undefined || this.profile.CurrentState == null || this.profile.CurrentState == '')
            {
              this.profile.CurrentState = ' ';
            }
            if(this.profile.CurrentCountry == undefined || this.profile.CurrentCountry == null || this.profile.CurrentCountry == '')
            {
              this.profile.CurrentCountry = ' ';
            }
            if(this.profile.CurrentPincode == undefined || this.profile.CurrentPincode == null || this.profile.CurrentPincode == '')
            {
              this.profile.CurrentPincode = ' ';
            }

            // API CALLING FOR currentAddress DETAILS
            this.currentAddressObject = {
              empID: window.localStorage['empid'],
              Type: "CurrentAddress",
              Address: (this.profile.CurrentAddress),
              City: this.profile.CurrentCity,
              State: this.profile.CurrentState,
              Country: this.profile.CurrentCountry,
              Pincode: this.profile.CurrentPincode
            };

            // console.log("currentAddress Detail Object " + this.currentAddressObject);
            // API CALLING FOR currentAddress DETAILS

            this.HttpRequest.GetRequest(this.Ipaddressservice.ipaddress1 +this.Ipaddressservice.serviceurlhrms+"EmployeeUpdate/" +  this.currentAddressObject.empID + "/" +  this.currentAddressObject.Type + "/" +  this.currentAddressObject.Address + "/" +  this.currentAddressObject.City + "/" +  this.currentAddressObject.State + "/" +  this.currentAddressObject.Country + "/" +  this.currentAddressObject.Pincode + "/0/0/0").then(resp=>{
              var data = JSON.parse(resp.toString());

                if (data[0].Column1 == "Successfully Updated") {
                  // Store the Data and Display the success message to user
                  this.error = "";

               alert("Current Address Updated");
               this.getEmployeeDetails();

                } else {
                  this.error = "Error Updating Profile";
                alert('Error Updating Profile');
                }
            }, error => {

            console.log("error : "+JSON.stringify(error));

            });
          }
        } else if (value == "current.cancel") {
          this.currentToggle = 0;
          this.getEmployeeDetails();
          // console.log("Cancel");
          // this.searchEmployees();
        }

        //PERMANENT CONDITIONS
        if (value == "permanent") {
          if (this.permanentToggle == 0) {
            this.permanentToggle = 1;
            // console.log("Edit");
          } else {
            this.permanentToggle = 0;
            // console.log("Update");
            if(this.profile.PermanentAddress == undefined || this.profile.PermanentAddress == null || this.profile.PermanentAddress == '')
            {
              this.profile.PermanentAddress = ' ';
            }
            if(this.profile.PermanentCity == undefined || this.profile.PermanentCity == null || this.profile.PermanentCity == '')
            {
              this.profile.PermanentCity = ' ';
            }
            if(this.profile.PermanentState == undefined || this.profile.PermanentState == null || this.profile.PermanentState == '')
            {
              this.profile.PermanentState = ' ';
            }
            if(this.profile.PermanentCountry == undefined || this.profile.PermanentCountry == null || this.profile.PermanentCountry == '')
            {
              this.profile.PermanentCountry = ' ';
            }
            if(this.profile.PermanentPincode == undefined || this.profile.PermanentPincode == null || this.profile.PermanentPincode == '')
            {
              this.profile.PermanentPincode = ' ';
            }


            // API CALLING FOR PERSONAL DETAILS
            this.PermanentAddressObject = {
              empID: window.localStorage['empid'],
              Type: "PermanentAddress",
              Address: (this.profile.PermanentAddress),
              City: this.profile.PermanentCity,
              State: this.profile.PermanentState,
              Country: this.profile.PermanentCountry,
              Pincode: this.profile.PermanentPincode
            };
            console.log(this.PermanentAddressObject);
            // console.log("PermanentAddress Detail Object " + this.PermanentAddressObject);
            // API CALLING FOR PermanentAddress DETAILS

            this.HttpRequest.GetRequest(this.Ipaddressservice.ipaddress1 +this.Ipaddressservice.serviceurlhrms+"EmployeeUpdate/" + this.PermanentAddressObject.empID + "/" + this.PermanentAddressObject.Type + "/" + this.PermanentAddressObject.Address + "/" + this.PermanentAddressObject.City + "/" + this.PermanentAddressObject.State + "/" + this.PermanentAddressObject.Country + "/" + this.PermanentAddressObject.Pincode + "/0/0/0").then(resp=>{
              var data = JSON.parse(resp.toString());
              // console.log(response);
              if (data[0].Column1 == "Successfully Updated") {
                // Store the Data and Display the success message to user
                this.error = "";

              alert('Permanent Address Updated');
              this.getEmployeeDetails();

              } else {
                this.error = "Error Updating Profile";
               alert('Error Updating Profile');
              }
            }, error => {

            console.log("error : "+JSON.stringify(error));

            });

          }
        } else if (value == "permanent.cancel") {
          this.permanentToggle = 0;
          this.getEmployeeDetails();
          // console.log("Cancel");
          // this.searchEmployees();
        }

        //CONTACT CONDITIONS
        if (value == "contact") {

          if(this.profile.Mobile.toString().length!=10){
alert("Enter Mobile Number and Contact Number Correctly");
          }
          else{
          if (this.contactToggle == 0) {
            this.contactToggle = 1;
            // console.log("Edit");
          } else {
            this.contactToggle = 0;
            // console.log("Update");

            if(this.profile.Email == undefined || this.profile.Email == null || this.profile.Email == '')
            {
              this.profile.Email = ' ';
            }
            if(this.profile.Mobile == undefined || this.profile.Mobile == null || this.profile.Mobile == 0)
            {
              this.profile.Mobile = null;
            }
            if(this.profile.EmergencyContactName == undefined || this.profile.EmergencyContactName == null || this.profile.EmergencyContactName == '')
            {
              this.profile.EmergencyContactName = ' ';
            }
            if(this.profile.EmergencyContactNumber == undefined || this.profile.EmergencyContactNumber == null || this.profile.EmergencyContactNumber == '')
            {
              this.profile.EmergencyContactNumber = ' ';
            }


            // API CALLING FOR CONTACT DETAILS
            this.ContactDetailsObject = {
              empID: window.localStorage['empid'],
              Type: "ContactDetails",
              Email: this.profile.Email,
              Mobile: this.profile.Mobile,
              EmergencyContactName: this.profile.EmergencyContactName,
              EmergencyContactNumber: this.profile.EmergencyContactNumber
            };
            // console.log("ContactDetails Detail Object " + this.ContactDetailsObject);
            // API CALLING FOR ContactDetails DETAILS
            this.HttpRequest.GetRequest(this.Ipaddressservice.ipaddress1 +this.Ipaddressservice.serviceurlhrms+"EmployeeUpdate/" + this.ContactDetailsObject.empID + "/" + this.ContactDetailsObject.Type + "/" + this.ContactDetailsObject.Email + "/" + this.ContactDetailsObject.Mobile + "/0/" + this.ContactDetailsObject.EmergencyContactName + "/" + this.ContactDetailsObject.EmergencyContactNumber + "/0/0/0").then(resp=>{
              var data = JSON.parse(resp.toString());
              // console.log(response);
              if (data[0].Column1 == "Successfully Updated") {
                // Store the Data and Display the success message to user
                this.error = "";
                // console.log("Updated Baby");

       alert("Contact Details Updated");
       this.getEmployeeDetails();

              } else {
                this.error = "Error Updating Profile";
                alert('Error Updating Profile');
              }
            }, error => {

            console.log("error : "+JSON.stringify(error));

            });


          }
        }

        } else if (value == "contact.cancel") {
          this.contactToggle = 0;
          this.getEmployeeDetails();
          // console.log("Cancel");
          // this.searchEmployees();
        }


  }
}
