import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, DocumentReference } from '@angular/fire/compat/firestore';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import firebase from 'firebase/compat/app';
import { Tran } from '../interfaces/tran';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private transactionsCollection: AngularFirestoreCollection<Tran>;
  private userId: string;

  constructor(private afs: AngularFirestore, private authService: AuthService) {
    this.authService.getCurrentUser().subscribe(user => {
      if (user) {
        this.userId = user.uid;
        this.transactionsCollection = this.afs.collection<Tran>(`users/${this.userId}/transactions`);
      }
    });
  }
  async getUserName(userId: string): Promise<string> {
    const userDoc = await this.afs.doc<User>(`users/${userId}`).get().toPromise();
    if (!userDoc.exists) {
      throw new Error(`User with ID ${userId} not found`);
    }
    const user = userDoc.data();
    return user.name;
  }

  getTransactions(userId: string): Observable<Tran[]> {
    return this.afs.collection<Tran>('transactions', ref => ref.where('userId', '==', userId)).valueChanges();
  }

  addTransaction(transaction: Tran): Promise<DocumentReference> {
    return this.transactionsCollection.add(transaction);
  }

  editTransaction(transaction: Tran): Promise<void> {
    return this.transactionsCollection.doc(transaction.id).update(transaction);
  }

  deleteTransaction(transactionId: string): Promise<void> {
    return this.transactionsCollection.doc(transactionId).delete();
  }

  // Método para obter o ID do usuário atualmente autenticado
  async getUserId(): Promise<string> {
    const user = await this.authService.getCurrentUser().toPromise();
    return user.uid;
  }
}

