import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Tran } from 'src/app/interfaces/tran';
import { AuthService } from 'src/app/services/auth.service';
import { TransactionService } from 'src/app/services/tran.service';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-teste',
  templateUrl: './teste.page.html',
  styleUrls: ['./teste.page.scss'],
})
export class TestePage implements OnInit {
  userName: string;
  transactions$: Observable<Tran[]>;
  userId: string;

  constructor(
    private authService: AuthService,
    private transactionService: TransactionService,
    private router: Router,
    private afAuth: AngularFireAuth
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
    this.transactions$ = this.transactionService.getTransactions(this.userId);
  }

  // Redireciona para a página de adição de transações
  addTransaction() {
    this.router.navigate(['/add-transaction']);
  }

  // Redireciona para a página de edição de transações
  editTransaction(transactionId: string) {
    this.router.navigate(['/edit-transaction', transactionId]);
  }

  // Deleta uma transação
  deleteTransaction(transactionId: string) {
    this.transactionService.deleteTransaction(transactionId);
  }

  async logout(): Promise<void> {
    return this.afAuth.signOut();
  }
}
