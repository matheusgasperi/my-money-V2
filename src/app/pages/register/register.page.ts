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
     private router: Router
     ) {}

  async register() {
    const user: User = { name: this.name, email: this.email };
    await this.authService.register(user, this.password);
    await this.router.navigate(['/teste']);

}
  checkPassword() {
    this.passwordMatch = this.password === this.confirmPassword;
  }
}
