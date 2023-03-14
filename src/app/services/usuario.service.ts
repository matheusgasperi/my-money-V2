/* eslint-disable object-shorthand */
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Tran } from '../interfaces/tran';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth
  ) {}

  async createUser(): Promise<void> {
    const user = await this.auth.currentUser;
    const userId = user?.uid;
    if (userId) {
      // Criar o documento do usuário
      await this.firestore.doc(`users/${userId}`).set({});

      // Criar uma nova transação para o usuário
      const newTran: Tran = {
        id: '',
        type: '',
        title: 'Nova transação',
        description: '',
        amount: 0,
        userId: userId,
        createdAt: new Date()
      };
      await this.addTransaction(newTran);
    }
  }

  async addTransaction(tran: Tran): Promise<void> {
    const user = await this.auth.currentUser;
    const userId = user?.uid;
    if (userId) {
      await this.firestore.collection(`users/${userId}/transactions`).add(tran);
    }
  }
}
