import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-resetpassword',
  templateUrl: './resetpassword.page.html',
  styleUrls: ['./resetpassword.page.scss'],
})
export class ResetpasswordPage {

  email: string;

  constructor(
    private afAuth: AngularFireAuth,
    private toastController: ToastController
  ) { }

  async resetPassword() {
    try {
      await this.afAuth.sendPasswordResetEmail(this.email);
      const toast = await this.toastController.create({
        message: 'Um e-mail com instruções para redefinir sua senha foi enviado para ' + this.email,
        duration: 5000
      });
      toast.present();
      this.dismiss();
    } catch (error) {
      const toast = await this.toastController.create({
        message: error.message,
        duration: 5000
      });
      toast.present();
    }
  }

  dismiss() {
    // Fecha o modal quando o usuário clica em "Fechar"
    (this as any).modal.dismiss();
  }


}
