import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userName: string;
  password: string;

  constructor(
    private authService: AuthService,
    private alertCtrl: AlertController,
    private router: Router
  ) { }

  ngOnInit() {

      this.authService.getCurrentUser().pipe(
        map(user => user.displayName)
      ).subscribe((displayName) => {
        this.userName = displayName;
      });


  }

  async onSubmit(form) {
    const confirm = await this.alertCtrl.create({
      header: 'Confirmar atualização',
      message: 'Tem certeza que deseja atualizar suas informações?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Atualizar',
          handler: async () => {
            try {
              if (this.userName) {
                await this.authService.updateUserName(this.userName);
              }

              if (this.password) {
                await this.authService.updateUserPassword(this.password);

              }

              form.reset();

              const alert = await this.alertCtrl.create({
                message: 'Informações atualizadas com sucesso! Relogue para atualizar...',
                buttons: ['OK']
              });
              await alert.present();

              this.router.navigateByUrl('/teste');

            } catch (error) {
              console.error(error);

              const alert = await this.alertCtrl.create({
                header: 'Erro',
                message: 'Erro ao atualizar informações.',
                buttons: ['OK']
              });
              await alert.present();
            }
          }
        }
      ]
    });

    await confirm.present();
  }
}
