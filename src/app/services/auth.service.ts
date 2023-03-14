import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UserCredential } from 'firebase/auth';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) { }

  // Registro de usuário
  async register(user: User, password: string): Promise<void> {
    const credential = await this.afAuth.createUserWithEmailAndPassword(user.email, password);
    const uid = credential.user.uid;
    const userData = { uid, email: user.email, name: user.name };
    return this.afs.doc(`users/${uid}`).set(userData);
  }

  // Login de usuário
  async login(email: string, password: string): Promise<void> {
    await this.afAuth.signInWithEmailAndPassword(email, password);
  }

  async getUserId(): Promise<string> {
    const currentUser = await this.afAuth.currentUser;
    if (!currentUser) {
      throw new Error('Usuario nao autenticado');
    }
    return currentUser.uid;
  }
  // Logout de usuário
  async logout(): Promise<void> {
    return this.afAuth.signOut();
  }

  // Retorna o usuário atualmente autenticado
  getCurrentUser() {
    return this.afAuth.authState;
  }
}


