import { TransactionService } from 'src/app/services/tran.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { LoadingController, ToastController, AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Tran } from './interfaces/tran';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  userName: string;
  userId: string;
  loading: any;

  constructor(
    private transactionService: TransactionService,
    private authService: AuthService,
    private router: Router,
    private afAuth: AngularFireAuth,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {}

  async ngOnInit() {
    // Obtém o ID do usuário atual
    this.userId = await this.authService.getUserId();

    // Obtém o nome do usuário
    this.transactionService.getUserName(this.userId).then((userName) => {
      this.userName = userName;
    }).catch((error) => {
      console.log(error);
    });
  }

  async confirmLogout() {
    const alert = await this.alertCtrl.create({
      header: 'Confirmação',
      message: 'Deseja realmente sair?',
      buttons: [
        {
          text: 'Não',
          role: 'cancel'
        }, {
          text: 'Sim',
          handler: () => {
            this.logout();
          }
        }
      ]
    });

    await alert.present();
  }

   async about() {
      const alert = await this.alertCtrl.create({
        message: 'Desenvolvido por Matheus Sutil de Gasperi',
        buttons: ['OK']
      });
      await alert.present();

    }

  async logout() {
    await this.presentLoading();

    try {
      await this.authService.logout();
    } catch (error) {
      console.error(error);
    } finally {
      this.loading.dismiss();
    }
  }

  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Aguarde...' });
    return this.loading.present();
  }
}
