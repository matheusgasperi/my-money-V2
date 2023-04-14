import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Tran } from 'src/app/interfaces/tran';
import { AuthService } from 'src/app/services/auth.service';
import { TransactionService } from 'src/app/services/tran.service';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { LoadingController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-teste',
  templateUrl: './teste.page.html',
  styleUrls: ['./teste.page.scss'],
})
export class TestePage implements OnInit {
  userName: string;
  transaction$: Observable<Tran[]>;
  userId: string;
  transactionId: string;
  loading: any;
  constructor(
    private authService: AuthService,
    private transactionService: TransactionService,
    private router: Router,
    private afAuth: AngularFireAuth,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) { }

  async ngOnInit() {
    // Obtém o ID do usuário atual
    this.userId = await this.authService.getUserId();

    // Obtém o nome do usuário
    this.transactionService.getUserName(this.userId).then((userName) => {
      this.userName = userName;
    }).catch((error) => {
      console.log(error);
    });

    // Obtém as transações do usuário
    this.transaction$ = this.transactionService.getTransactions(this.userId);
  }

  // Redireciona para a página de adição de transações
  addTransaction() {
    this.router.navigate(['/add-transaction']);
  }

  // Redireciona para a página de edição de transações
  editTransaction(transactionId: string) {
    this.router.navigate(['/edit-transaction', transactionId]);
  }

  deleteTransaction() {
    this.transactionService.deleteTransaction(this.transactionId).then(() => {
      this.router.navigateByUrl('/teste');
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
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
