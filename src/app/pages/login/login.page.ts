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
    if(this.email && this.password)
   {
     const loading = await this.loadingCrtl.create({
       message: 'Logando..',
       spinner: 'crescent',
       showBackdrop: true
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
  }


 async register() {

  if(this.name && this.email && this.password)
  {
    const loading = await this.loadingCrtl.create({
      message: 'Carregando, Por favor Aguarde',
      spinner: 'crescent',
      showBackdrop: true
    });

    loading.present();

    this.afauth.createUserWithEmailAndPassword(this.email, this.password).then((data)=> {

      this.afs.collection('usuarios').doc(data.user.uid).set({
        'userId': data.user.uid,
        'name': this.name,
        'email': this.email,
        'createdAt': Date.now()
      });

    })
    .then(()=> {
      loading.dismiss();
      this.toast('Registrado com sucesso!', 'success');
      this.router.navigate(['/teste'])

    })
    .catch((error) => {
      loading.dismiss();
      this.toast(error.message, 'danger');
    })
  } else {
    console.log('Por favor preencha os dados');

  }

} //fim registro

checkPassword() {
  if(this.password == this.confirmPassword)
  {
    this.passwordMatch = true;
  } else {
    this.passwordMatch = false;
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
