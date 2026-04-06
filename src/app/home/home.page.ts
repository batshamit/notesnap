/*import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton],
})
export class HomePage {
  constructor() {}
}
*/

import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular/standalone';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton }
  from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton],
})
export class HomePage {
  constructor(private alertCtrl: AlertController) {}

  async showAlert() {
    const alert = await this.alertCtrl.create({
      header: 'NoteSnap Ready!',
      message: 'Ionic 8 + Angular 19 is running!',
      buttons: ['Let\'s Go!'],
    });
    await alert.present();
  }
}
