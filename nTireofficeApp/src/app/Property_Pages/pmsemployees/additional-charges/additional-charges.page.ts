import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-additional-charges',
  templateUrl: './additional-charges.page.html',
  styleUrls: ['./additional-charges.page.scss'],
})
export class AdditionalChargesPage implements OnInit {
  showView:boolean=false;

 
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
  }
  submit(){
    debugger;
    this.showView = true;

      }
      cancel() {
        return this.modalCtrl.dismiss(null, 'cancel');
      }
}
