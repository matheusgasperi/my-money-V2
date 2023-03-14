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


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;

  name: string;
  email: string;
  password: string;
  confirmPassword: string;

  passwordMatch: boolean;


  constructor(
    private afauth: AngularFireAuth,
    private afs: AngularFirestore,
    private loadingCrtl: LoadingController,
    private toastCrtl: ToastController,
    private authService: AuthService,
    private router: Router,
    private activeRoute: ActivatedRoute,
  ) {

  }

  ngOnInit() {
  }



    async login() {
      try {
        await this.authService.login(this.email, this.password);
        this.router.navigate(['/teste']);
      } catch (error) {
        console.error(error);
      }

     const loading = await this.loadingCrtl.create({
       message: 'Logando..',
       spinner: 'crescent',
       showBackdrop: true,
     });

     loading.present();

     this.authService.login(this.email, this.password)
     .then(()=> {
       loading.dismiss();
     })
     .catch((error)=> {
       loading.dismiss();
       this.toast(error.message, 'danger');
     })

  }


async toast(message, status)
{
  const toast = await this.toastCrtl.create({
    message: message,
    position: 'top',
    color: status,
    duration: 2500
  })

  toast.present();
}
}
