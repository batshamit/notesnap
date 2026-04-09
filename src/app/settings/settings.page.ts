import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonMenuButton,
  IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonItem, IonLabel, IonToggle, IonButton // <-- Imported IonButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  standalone: true,
  imports: [CommonModule, FormsModule, 
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonMenuButton,
    IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonItem, IonLabel, IonToggle, IonButton] // <-- Added IonButton
})
export class SettingsPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  // FIXED: Ionic 8 Dark Mode Palette toggle
  toggleDark(event: any) {
    document.documentElement.classList.toggle('ion-palette-dark', event.detail.checked);
    // Keeping the legacy class just in case your theme file requires it
    document.body.classList.toggle('dark', event.detail.checked);
  }

  // Challenge 2 logic
  clearAll() {
    console.log('🧹 Clear All Notes clicked! (Data will actually wipe in Lesson 4)');
  }
}