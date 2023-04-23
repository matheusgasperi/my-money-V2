import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { UserCredential } from 'firebase/auth';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import firebase from 'firebase/compat/app';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: firebase.User;

  constructor(private afAuth: AngularFireAuth,
     private afs: AngularFirestore, private router: Router, private storage: AngularFireStorage) { }

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

  // Login com o Google
  async googleLogin(): Promise<void> {
    const provider = new firebase.auth.GoogleAuthProvider();
    const credential = await this.afAuth.signInWithPopup(provider);
    const uid = credential.user.uid;
    const userData = { uid, email: credential.user.email, name: credential.user.displayName };
    return this.afs.doc(`users/${uid}`).set(userData);
  }

  // Login com o Facebook
  async facebookLogin(): Promise<void> {
    const provider = new firebase.auth.FacebookAuthProvider();
    const credential = await this.afAuth.signInWithPopup(provider);
    const uid = credential.user.uid;
    const userData = { uid, email: credential.user.email, name: credential.user.displayName };
    return this.afs.doc(`users/${uid}`).set(userData);
  }

  // Obter ID do usuário
  async getUserId(): Promise<string> {
    const currentUser = await this.afAuth.currentUser;
    if (!currentUser) {
      throw new Error('Usuário não autenticado');
    }
    return currentUser.uid;
  }

  // Logout de usuário
  logout() {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['/welcome']);
    });
  }

  // Retorna o usuário atualmente autenticado
  getCurrentUser() {
    return this.afAuth.authState;
  }



  // Atualiza o nome do usuário
  async updateUserName(name: string): Promise<void> {
    const currentUser = await this.afAuth.currentUser;
    if (!currentUser) {
      throw new Error('Usuário não autenticado');
    }
    await currentUser.updateProfile({
      displayName: name
    });
    const uid = currentUser.uid;
    const userData = { uid, email: currentUser.email, name };
    return this.afs.doc(`users/${uid}`).set(userData, { merge: true });
  }

  // Atualiza a senha do usuário
  async updateUserPassword(password: string): Promise<void> {
    const currentUser = await this.afAuth.currentUser;
    if (!currentUser) {
      throw new Error('Usuário não autenticado');
    }
    return currentUser.updatePassword(password);
  }
}
