import { AlertController } from '@ionic/angular';
/* eslint-disable eqeqeq */
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable quote-props */

/* eslint-disable @typescript-eslint/quotes */
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides, LoadingController, ToastController } from '@ionic/angular';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';





@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {

  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  passwordMatch: boolean;
  errorMsg: string;

  constructor(private authService: AuthService,
     private router: Router,
      private afAuth: AngularFireAuth,
       private afs: AngularFirestore,
       private alertCtrl: AlertController
     ) {}

     async register() {
      const user: User = { name: this.name, email: this.email };
      try {
        await this.authService.register(user, this.password);
        await this.router.navigate(['/teste']);
      } catch (error) {
        let errorMessage: string;
        switch (error.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'O e-mail já está em uso.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'O e-mail é inválido.';
            break;
          case 'auth/weak-password':
            errorMessage = 'Senha fraca.';
            break;
          default:
            errorMessage = 'Ocorreu um erro ao cadastrar.';
            break;
        }
        const alert = await this.alertCtrl.create({
          header: 'Erro',
          message: errorMessage,
          buttons: ['OK']
        });
        await alert.present();
      }
    }

async registerWithGoogle() {
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    const credential = await this.afAuth.signInWithPopup(provider);
    const uid = credential.user.uid;
    const userData = { uid, email: credential.user.email, name: credential.user.displayName };
    await this.afs.doc(`users/${uid}`).set(userData);
    await this.router.navigate(['/teste']);
  } catch (error) {
    console.log('Erro ao autenticar com o Google:', error);
  }
}

async registerWithFacebook() {
  try {
    const provider = new firebase.auth.FacebookAuthProvider();
    const credential = await this.afAuth.signInWithPopup(provider);
    const uid = credential.user.uid;
    const userData = { uid, email: credential.user.email, name: credential.user.displayName };
    await this.afs.doc(`users/${uid}`).set(userData);
    await this.router.navigate(['/teste']);
  } catch (error) {
    console.log('Erro ao autenticar com o Facebook:', error);
  }
}


  async loginWithFacebook(): Promise<void> {
    const provider = new firebase.auth.FacebookAuthProvider();
    await this.afAuth.signInWithPopup(provider);
  }

  checkPassword() {
    this.passwordMatch = this.password === this.confirmPassword;
  }
}
