import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AlertController, LoadingController } from '@ionic/angular';

import { ICheckIn, FirebaseService } from '../services/firebase.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
    providers: []
})
export class Tab1Page implements OnInit {

    name: string;
  checkIns: ICheckIn[];

  constructor(private barcodeScanner: BarcodeScanner,
              private _dataService: FirebaseService,
              private _storage: Storage,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController) {}

  ngOnInit(): void {
      this._storage.get('name').then(name => {
          if (!name) {
              this.openModal();
          }
          this.name = name;
      });
        this._dataService.getCheckIns().subscribe(res => {
            console.dir(res);
            this.checkIns = res;
        });
    }

  scanBarcode() {
    this.barcodeScanner.scan().then(barcodeData => {
      let checkInObj: ICheckIn = {
          barcode_value: barcodeData.text.toString(),
          check_in_name: this.name,
          date: new Date().toDateString(),
      };

      console.log('Barcode data', checkInObj);
      this._dataService.addCheckIn(checkInObj).then(res => alert("Your check-in have been added !"));
    }).catch(err => {
      console.log('Error', err);
    });
  }

   async openModal() {
       let alert = await this.alertCtrl.create({
          message: 'Please enter your full name',
           backdropDismiss: false,
          inputs: [
              {
                  name: 'fullName',
                  placeholder: 'Full Name'
              }
          ],
          buttons: [
              {
                  text: 'Ok',
                  handler: data => {
                    this._storage.set('name', data.fullName);
                    this.name = data.fullName;
                  }
              }
          ]
      });

       await alert.present();
  }
}
