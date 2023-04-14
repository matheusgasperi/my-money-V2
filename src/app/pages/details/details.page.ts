import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  transaction: Tran;
  transactionId: string;

  constructor(
    private formBuilder: FormBuilder,
    private transactionService: TransactionService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.transactionForm = this.formBuilder.group({
      type: ['', Validators.required],
      title: ['', Validators.required],
      description: [''],
      amount: ['', Validators.required],
      createdAt: ['', Validators.required],

    });
  }

  ngOnInit() {
    this.transactionId = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.transactionId) {
      this.transactionService.getTransaction(this.transactionId).subscribe((transaction) => {
        this.transaction = transaction;
        this.transactionForm.patchValue({
          type: transaction.type,
          title: transaction.title,
          description: transaction.description,
          amount: transaction.amount,


        });
      });
    }
  }

  addTransaction() {
    const formValues = this.transactionForm.value;

    if (this.transaction) {
      this.transactionService.updateTran(this.transactionId, formValues).then(() => {
        this.router.navigateByUrl('/teste');
      });
    } else {
      this.transactionService.createTransaction(formValues).then(() => {
        this.router.navigateByUrl('/teste');
      });
    }
  }


}

