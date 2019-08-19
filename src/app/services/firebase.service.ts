import { Injectable } from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/firestore";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

export interface ICheckIn {
  id?: string;
  date: string;
  barcode_value: string;
  check_in_name: string;
}


@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private checkInCollection: AngularFirestoreCollection<ICheckIn>;

  private readonly checkIns: Observable<ICheckIn[]>;

  constructor(private firebaseDb: AngularFirestore){
    this.checkInCollection = firebaseDb.collection<ICheckIn>('checkIns');

    this.checkIns = this.checkInCollection.snapshotChanges().pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data();
            const id = a.payload.doc.id;
            return {id, ...data};
          });
        })
    );
  }

  getCheckIns() {
    return this.checkIns;
  }

  addCheckIn(checkInObj: ICheckIn) {
    return this.checkInCollection.add(checkInObj);
  }

}
