/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable curly */
import { Subscription } from 'rxjs';
/* eslint-disable @typescript-eslint/dot-notation */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { Tran } from 'src/app/interfaces/tran';
import { AuthService } from 'src/app/services/auth.service';
import { TranService } from 'src/app/services/tran.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  public tran: Tran = {};
  private loading: any;
  private tranId: string = null;
  private tranSubscription: Subscription;

  constructor(
    private loadingCrtl: LoadingController,
    private toastCrtl: ToastController,
    private authService: AuthService,
    private activeRoute: ActivatedRoute,
    private tranService: TranService,
    private navCrtl: NavController
  ) {
    this.tranId = this.activeRoute.snapshot.params['id'];

    if (this.tranId) this.loadTran();
   }

  ngOnInit() { }

  ngOnDestroy() {
    if (this.tranSubscription) this.tranSubscription.unsubscribe();
  }

  loadTran() {
    this.tranSubscription = this.tranService.getTran(this.tranId).subscribe(data => {
      this.tran = data;
    });
  }

  async saveTran() {
    await this.presentLoading();

    this.tran.userId = (await this.authService.getAuth().currentUser).uid;

    if (this.tranId) {
      try {
        await this.tranService.updateTran(this.tranId, this.tran);
        await this.loading.dismiss();

       this.navCrtl.navigateBack('/teste');
     }catch (error) {
       this.presentToast('Error ao tentar salvar');
       this.loading.dismiss();
     }
    } else {
      this.tran.createdAt = new Date().getTime();

      try {
         await this.tranService.addTran(this.tran);
         await this.loading.dismiss();

        this.navCrtl.navigateBack('/teste');
      }catch (error) {
        this.presentToast('Error ao tentar salvar');
        this.loading.dismiss();
      }
    }
  }

  async presentLoading() {
    this.loading = await this.loadingCrtl.create({ message: 'Por favor, aguarde...'});
    return this.loading.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCrtl.create({ message, duration: 2000 });
    toast.present();
  }
}
