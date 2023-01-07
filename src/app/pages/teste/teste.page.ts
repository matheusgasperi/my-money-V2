/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/member-ordering */

import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { TranService } from 'src/app/services/tran.service';
import { Tran } from 'src/app/interfaces/tran';
import { Subscription } from 'rxjs';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-teste',
  templateUrl: './teste.page.html',
  styleUrls: ['./teste.page.scss'],
})
export class TestePage implements OnInit {

  private loading: any;
  public trans = new Array<Tran>();
  private transSubscription: Subscription;



  constructor(

    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private tranService: TranService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {

    this.transSubscription = this.tranService.getTrans().subscribe(data => {
      this.trans = data;
    });
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.transSubscription.unsubscribe();
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

  async deleteTran(id: string) {

    try {
      await this.tranService.deleteTran(id);
    } catch (error) {
      this.presentToast('Erro ao tentar deletar');
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }
}



