import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';

import { ICheckIn, FirebaseService } from '../services/firebase.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {

  checkIns: ICheckIn[];

  constructor(private barcodeScanner: BarcodeScanner, private _dataService: FirebaseService) {}

  ngOnInit(): void {
        this._dataService.getCheckIns().subscribe(res => {
            console.dir(res);
            this.checkIns = res;
        });
    }

  scanBarcode() {
    this.barcodeScanner.scan().then(barcodeData => {
      let checkInObj: ICheckIn = {
          barcode_value: barcodeData.text.toString(),
          check_in_name: 'Daniel',
          date: new Date().toDateString(),
      };

      console.log('Barcode data', checkInObj);
      this._dataService.addCheckIn(checkInObj).then(res => alert("Your check-in have been added !"));
    }).catch(err => {
      console.log('Error', err);
    });
  }

}
