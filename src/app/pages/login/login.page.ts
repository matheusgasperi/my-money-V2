/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable eqeqeq */
/* eslint-disable object-shorthand */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable quote-props */

/* eslint-disable @typescript-eslint/quotes */
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides, LoadingController, ModalController, ToastController } from '@ionic/angular';
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

  name: string;
  email: string;
  password: string;
  confirmPassword: string;

  passwordMatch: boolean;
  rememberMe: boolean = false;

  constructor(
    private afauth: AngularFireAuth,
    private afs: AngularFirestore,
    private loadingCrtl: LoadingController,
    private toastCrtl: ToastController,
    private authService: AuthService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private modalCtrl: ModalController
  ) {

  }

  ngOnInit() {
     // Recupera as credenciais do usuário armazenadas localmente
    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');

    if (email && password) {
      this.email = email;
      this.password = password;
      this.rememberMe = true;
    }
  }
  async openForgotPassword() {
    const modal = await this.modalCtrl.create({
      component: ForgotPasswordModalComponent,
      cssClass: 'my-custom-class'
    });
    return await modal.present();
  }

  saveCredentials(email: string, password: string) {
    // Armazena as credenciais no LocalStorage
    localStorage.setItem('email', email);
    localStorage.setItem('password', password);
  }

  async login() {
    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/teste']);

      // Salva as credenciais do usuário localmente se o checkbox "Lembrar-me" estiver marcado
      if (this.rememberMe) {
        this.saveCredentials(this.email, this.password);
      } else {
        localStorage.removeItem('email');
        localStorage.removeItem('password');
      }
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
      .then(() => {
        loading.dismiss();
      })
      .catch((error) => {
        loading.dismiss();
        this.toast(error.message, 'danger');
      })
  }


  async googleLogin(): Promise<void> {
    try {
      await this.authService.googleLogin();
      this.router.navigateByUrl('/teste');
    } catch (error) {
      console.log(error);
    }
  }

  async facebookLogin(): Promise<void> {
    try {
      await this.authService.facebookLogin();
      this.router.navigateByUrl('/teste');
    } catch (error) {
      console.log(error);
    }
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
