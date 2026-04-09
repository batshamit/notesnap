import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonMenuButton,
  IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonItem, IonLabel, IonToggle, IonButton,
  AlertController 
} from '@ionic/angular/standalone';
import { NotesService } from '../services/notes';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  standalone: true,
  imports: [CommonModule, FormsModule, 
    IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonMenuButton,
    IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonItem, IonLabel, IonToggle, IonButton]
})
export class SettingsPage {
  noteCount = 0;
  lastAddedDate: Date | null = null;
  
  // 1. New variable to track the toggle's state
  isDarkMode = false; 

  constructor(private notesService: NotesService, private alertCtrl: AlertController) { }

  async ionViewWillEnter() {
    const notes = await this.notesService.getNotes();
    this.noteCount = notes.length;
    
    if (notes.length > 0) {
      const sorted = notes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      this.lastAddedDate = sorted[0].createdAt;
    } else {
      this.lastAddedDate = null;
    }

    // 2. Read the actual background state when the page loads
    this.isDarkMode = document.documentElement.classList.contains('ion-palette-dark');
  }

  // 3. Updated function to use our new variable
  toggleDark() {
    document.documentElement.classList.toggle('ion-palette-dark', this.isDarkMode);
    document.body.classList.toggle('dark', this.isDarkMode);
  }

  async confirmClearAll() {
    const alert = await this.alertCtrl.create({
      header: 'Are you sure?',
      message: 'This will permanently delete all your saved notes.',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        { text: 'Delete', role: 'destructive', handler: () => this.clearAll() }
      ]
    });
    await alert.present();
  }

  async clearAll() {
    await this.notesService.clearAll(); 
    this.noteCount = 0;
    this.lastAddedDate = null;
  }
}