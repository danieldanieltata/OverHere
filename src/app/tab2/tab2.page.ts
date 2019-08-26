import { Component } from '@angular/core';
import { FirebaseService, ICheckIn } from '../services/firebase.service';
import {LoadingController} from "@ionic/angular";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  isLoading = true;
  checkInsList: ICheckIn[];

  constructor(private _dataService: FirebaseService, private loadingCtrl: LoadingController) {
    this.present();
    _dataService.getCheckIns().subscribe(checkIns => {
        this.checkInsList = checkIns;
        this.dismiss();
    });
  }

  async present() {
    this.isLoading = true;
    return await this.loadingCtrl.create({
      message: 'Loading...',
      duration: 5000,
    }).then(a => {
      a.present().then(() => {
        console.log('presented');
        if (!this.isLoading) {
          a.dismiss().then(() => console.log('abort presenting'));
        }
      });
    });
  }

  async dismiss() {
    this.isLoading = false;
    return await this.loadingCtrl.dismiss().then(() => console.log('dismissed'));
  }
}
