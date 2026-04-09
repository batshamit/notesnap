import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { 
  IonApp, IonRouterOutlet, IonSplitPane, IonMenu, IonHeader, 
  IonToolbar, IonTitle, IonContent, IonList, IonMenuToggle, 
  IonItem, IonIcon, IonLabel 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { documentText, settings, informationCircle } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [
    RouterLink, RouterLinkActive, IonApp, IonRouterOutlet, IonSplitPane, 
    IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, 
    IonMenuToggle, IonItem, IonIcon, IonLabel
  ],
})
export class AppComponent {
  constructor() {
    addIcons({documentText,settings,informationCircle});
  }
}