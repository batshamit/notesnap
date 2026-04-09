import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Note } from './note.model';
import { NotesService } from '../services/notes';
import { ToastController, AlertController } from '@ionic/angular/standalone';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList,
  IonItem, IonLabel, IonBadge, IonChip, IonFab, IonFabButton,
  IonIcon, IonSearchbar, IonButton, 
  IonMenuButton, IonButtons, IonModal, IonInput, IonTextarea, 
  IonSelect, IonSelectOption, 
  IonRadioGroup, IonRadio, IonListHeader, 
  IonSegment, IonSegmentButton,
  IonPopover // <-- 1. Added Popover import!
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, trash, documentText, settings, create, options } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle,
    IonContent, IonList, IonItem, IonLabel, IonBadge, IonChip,
    IonFab, IonFabButton, IonIcon, IonSearchbar, IonButton,
    IonMenuButton, IonButtons, IonModal, IonInput, IonTextarea, 
    IonSelect, IonSelectOption, IonRadioGroup, IonRadio, IonListHeader,
    IonSegment, IonSegmentButton, IonPopover], // <-- 2. Added to imports array
})
export class HomePage implements OnInit {
  searchTerm = '';
  notes: Note[] = [];

  selectedCategory = 'All'; 

  // --- FILTER VARIABLE (Removed the open/close boolean!) ---
  sortBy: 'newest' | 'oldest' = 'newest';

  // --- ADD/EDIT MODAL VARIABLES ---
  isModalOpen = false;
  editingNoteId: string | null = null;
  newNoteTitle = '';
  newNoteContent = '';
  newNoteCategory: 'Personal' | 'Study' | 'Work' = 'Personal';

  constructor(
    private toastCtrl: ToastController, 
    private alertCtrl: AlertController, 
    private notesService: NotesService
  ) {
    addIcons({ add, trash, documentText, settings, create, options });
  }

  async ngOnInit() {
    this.notes = await this.notesService.getNotes();
  }

  get filteredNotes(): Note[] {
    let filtered = this.notes;

    if (this.selectedCategory !== 'All') {
      filtered = filtered.filter(n => n.category === this.selectedCategory);
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(n => {
        const dateStr = n.createdAt.toLocaleDateString().toLowerCase();
        const monthStr = n.createdAt.toLocaleString('default', { month: 'short' }).toLowerCase();

        return n.title.toLowerCase().includes(term) ||
               n.content.toLowerCase().includes(term) ||
               dateStr.includes(term) || 
               monthStr.includes(term); 
      });
    }

    filtered.sort((a, b) => {
      if (this.sortBy === 'newest') {
        return b.createdAt.getTime() - a.createdAt.getTime();
      } else {
        return a.createdAt.getTime() - b.createdAt.getTime();
      }
    });

    return filtered;
  }

  async deleteNote(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Delete Note?',
      message: 'Are you sure you want to permanently delete this note?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            await this.notesService.deleteNote(id);
            this.notes = await this.notesService.getNotes(); 
            const toast = await this.toastCtrl.create({ message: 'Note deleted', duration: 1500, color: 'danger' });
            await toast.present();
          }
        }
      ]
    });
    await alert.present();
  }

  openAddModal() {
    this.editingNoteId = null;
    this.newNoteTitle = '';
    this.newNoteContent = '';
    this.newNoteCategory = 'Personal';
    this.isModalOpen = true;
  }

  openEditModal(note: Note) {
    this.editingNoteId = note.id;
    this.newNoteTitle = note.title;
    this.newNoteContent = note.content;
    this.newNoteCategory = note.category;
    this.isModalOpen = true;
  }

  async saveNote() {
    if (this.editingNoteId) {
      const alert = await this.alertCtrl.create({
        header: 'Save Changes?',
        message: 'Do you want to overwrite this note?',
        buttons: [
          { text: 'Discard', role: 'cancel' },
          { text: 'Save', handler: async () => await this.executeSave() }
        ]
      });
      await alert.present();
    } else {
      await this.executeSave();
    }
  }

  private async executeSave() {
    if (this.editingNoteId) {
      await this.notesService.updateNote(this.editingNoteId, this.newNoteTitle, this.newNoteContent, this.newNoteCategory);
    } else {
      await this.notesService.addNote(this.newNoteTitle, this.newNoteContent, this.newNoteCategory);
    }
    this.notes = await this.notesService.getNotes();
    this.isModalOpen = false;
    const toast = await this.toastCtrl.create({
      message: this.editingNoteId ? 'Note updated!' : 'Note saved!', duration: 1500, color: 'success'
    });
    await toast.present();
  }
}