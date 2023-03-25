import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Tran } from 'src/app/interfaces/tran';
import { TransactionService } from 'src/app/services/tran.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  transactionForm: FormGroup;
  transactionId: string;
  isEditMode = false;

  constructor(
    private formBuilder: FormBuilder,
    private transactionService: TransactionService,
    private navController: NavController,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.transactionId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.transactionId) {
      this.isEditMode = true;
      this.loadTransactions();
    } else {
      this.createTransactionForm();
    }
  }

  createTransactionForm() {
    this.transactionForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      type: ['gasto', Validators.required],
      amount: [0, Validators.required],
      date: [new Date().toISOString(), Validators.required]
    });
  }

  async addTransaction() {
    console.log('addTransaction');
    const newTransaction = {
      ...this.transactionForm.value,
      date: new Date(this.transactionForm.value.date).getTime(),
    };
    try {
      console.log('Chamando createTransaction');
      await this.transactionService.createTransaction(newTransaction);
      console.log('Transaction criada com sucesso');

      this.navController.navigateBack('/teste');
    } catch (error) {
      console.error(error);
    }
  }

 async loadTransactions(): Promise<void> {
    try {
      const userId = await this.transactionService.getUserId();
      const transaction = (await this.transactionService.getTransactions(userId).toPromise())[0];
      this.transactionForm.patchValue({
        title: transaction.title,
        description: transaction.description,
        type: transaction.type,
        amount: transaction.amount,
        date: new Date(transaction.createdAt).toISOString(),
      });
    } catch (error) {
      console.log(error);
    }
  }
  onSubmit() {
    console.log(this.transactionForm.value);
}
  async updateTransaction() {
    const updatedTransaction = {
      ...this.transactionForm.value,
      date: new Date(this.transactionForm.value.date).getTime(),
      id: this.transactionId,
    };
    try {
      await this.transactionService.editTransaction(updatedTransaction);
      this.navController.navigateBack('/teste');
    } catch (error) {
      console.error(error);
    }
  }

}
