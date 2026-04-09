import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Note } from './note.model';
import { ToastController } from '@ionic/angular/standalone';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList,
  IonItem, IonLabel, IonBadge, IonChip, IonFab, IonFabButton,
  IonIcon, IonSearchbar, IonButton, 
  IonSegment, IonSegmentButton,
  IonMenuButton, IonButtons // <-- NEW IMPORTS FOR LESSON 3
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, trash, documentText, settings } from 'ionicons/icons'; // <-- ADDED MENU ICONS

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle,
    IonContent, IonList, IonItem, IonLabel, IonBadge, IonChip,
    IonFab, IonFabButton, IonIcon, IonSearchbar, IonButton,
    IonSegment, IonSegmentButton, 
    IonMenuButton, IonButtons], // <-- ADDED TO IMPORTS ARRAY
})
export class HomePage {
  searchTerm = '';
  selectedCategory = 'All'; 

  notes: Note[] = [
    { id: '1', title: 'Buy groceries', content: 'Milk, eggs, bread',
      category: 'Personal', createdAt: new Date() },
    { id: '2', title: 'Study Angular Signals', content: 'Review signal() docs',
      category: 'Study', createdAt: new Date() },
    { id: '3', title: 'Team meeting notes', content: 'Sprint review at 3pm',
      category: 'Work', createdAt: new Date() },
    { id: '4', title: 'Complete Ionic Challenges', content: 'Finish Lesson 2 practice tasks',
      category: 'Study', createdAt: new Date() }
  ];

  constructor(private toastCtrl: ToastController) {
    addIcons({ add, trash, documentText, settings });
  }

  get filteredNotes(): Note[] {
    let filtered = this.notes;

    if (this.selectedCategory !== 'All') {
      filtered = filtered.filter(n => n.category === this.selectedCategory);
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(term) ||
        n.content.toLowerCase().includes(term) ||
        n.category.toLowerCase().includes(term)
      );
    }

    return filtered;
  }

  async deleteNote(id: string) {
    this.notes = this.notes.filter(n => n.id !== id);
    const toast = await this.toastCtrl.create({
      message: 'Note deleted', duration: 1500, color: 'danger', position: 'bottom'
    });
    await toast.present();
  }

  openAddModal() { console.log('Add modal coming in Lesson 4!'); }
}