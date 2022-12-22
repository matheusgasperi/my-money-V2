
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable arrow-body-style */
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore,  AngularFirestoreCollection, docChanges } from '@angular/fire/compat/firestore';
import { map } from 'rxjs/operators';
import { Tran } from '../interfaces/tran';
import { doc, docData} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class TranService {
  private transCollection = this.afs.collection<Tran>('Trans')

  constructor(
    private afs: AngularFirestore,
    private auth: AngularFireAuth,

    ) {
    }

  getTrans() {
    return this.transCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;

          return {id, ...data };
        })
      })
    )
  }

  addTran(tran: Tran) {
    return this.transCollection.add(tran);
  }

  getTran(id: string) {
    return this.transCollection.doc<Tran>(id).valueChanges();
  }

  updateTran(id: string, tran: Tran) {
    return this.transCollection.doc<Tran>(id).update(tran);
  }

  deleteTran(id: string) {
   return this.transCollection.doc(id).delete();
  }
}
