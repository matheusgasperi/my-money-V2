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
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
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

  constructor(private authService: AuthService,
     private router: Router, private afAuth: AngularFireAuth, private afs: AngularFirestore
     ) {}

  async register() {
    const user: User = { name: this.name, email: this.email };
    await this.authService.register(user, this.password);
    await this.router.navigate(['/teste']);
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
