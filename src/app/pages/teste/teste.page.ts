import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Tran } from 'src/app/interfaces/tran';
import { AuthService } from 'src/app/services/auth.service';
import { TransactionService } from 'src/app/services/tran.service';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { AngularFireStorage } from '@angular/fire/compat/storage';

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
  dummyTransactions = new Array(3).fill(null);


  constructor(
    private authService: AuthService,
    private transactionService: TransactionService,
    private router: Router,
    private afAuth: AngularFireAuth,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private storage: AngularFireStorage
  ) {
    setTimeout(() => {
      this.loading = false; // altera a variável loading após 3 segundos
    }, 3000);
  }


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

  async deleteTransaction(transactionId: string) {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar exclusão',
      message: 'Tem certeza que deseja excluir essa transação?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Excluir',
          handler: async () => {
            try {
              await this.presentLoading();
              await this.transactionService.deleteTransaction(transactionId);
              this.presentToast('Transação excluída com sucesso!');
            } catch (error) {
              console.error(error);
              this.presentToast('Erro ao excluir transação.');
            } finally {
              this.loading.dismiss();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({ message, duration: 2000 });
    toast.present();
  }



  async presentLoading() {
    this.loading = await this.loadingCtrl.create({ message: 'Aguarde...' });
    return this.loading.present();
  }
}
