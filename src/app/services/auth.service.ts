/* eslint-disable object-shorthand */
/* eslint-disable curly */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable arrow-body-style */
import { getAuth, createUserWithEmailAndPassword, UserInfo } from 'firebase/auth';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from '../interfaces/user';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { switchMap} from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<User>;
  user: User;

  constructor(
    private afauth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private loadingCrtl: LoadingController,
    private toastCrtl: ToastController,)
    {

      this.user$ = this.afauth.authState.pipe(
         switchMap(user=>
          {
             if(user)
             {
               this.afs.doc(`usuarios/${user.uid}`).valueChanges();
             } else {
               return of(null);
             }
          })
      )
    }
    async login(email, password) {

     const loading = await this.loadingCrtl.create({
       message: 'Autenticando..',
       spinner: 'crescent',
       showBackdrop: true
     })

     loading.present();

    this.afauth.signInWithEmailAndPassword(email, password).then((data)=> {
      if(!data.user)
       {
         loading.dismiss();
       } else {
         loading.dismiss();
       }
   });
  }

  async toast(message, status) {
    const toast = await this.toastCrtl.create({
      message: message,
      position: 'top',
      color: status,
      duration: 2500
    })

    toast.present();
  } //fim do toast


  logout() {
   this.afauth.signOut().then(()=> {
     this.router.navigate(['login']);
   });
  }

  getAuth() {
    return this.afauth;
  }

}
