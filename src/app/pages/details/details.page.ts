/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable curly */
import { Subscription } from 'rxjs';
/* eslint-disable @typescript-eslint/dot-notation */
import { Component, OnInit } from '@angular/core';
import { Tran } from 'src/app/interfaces/tran';
import { TransactionService } from 'src/app/services/tran.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  tran: Tran = {
    id: '',
    type: '',
    title: '',
    description: '',
    amount: null,
    userId: '',
    createdAt: Date.now(),
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private tranService: TransactionService
  ) {}

  ngOnInit() {
    // Obter o ID da transação a partir dos parâmetros da URL
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.tranService.getTransactions(id).subscribe(tran => {
        this.tran = tran[0];
      });
    }
  }

  async addTransaction() {
    console.log('Adicionando transação');
    try {
      const userId = await this.tranService.getUserId();
      this.tran.userId = userId;
      await this.tranService.addTransaction(this.tran);
      console.log('Transação adicionada com sucesso');
      this.router.navigateByUrl('/teste');
    } catch (error) {
      console.error(error);
    }
  }
}
