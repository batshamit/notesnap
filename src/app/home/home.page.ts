import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Note } from './note.model';
import { NotesService } from '../services/notes'; // <-- Fixed the import for you!
import { ToastController, AlertController } from '@ionic/angular/standalone';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList,
  IonItem, IonLabel, IonBadge, IonChip, IonFab, IonFabButton,
  IonIcon, IonSearchbar, IonButton, 
  IonMenuButton, IonButtons, IonModal, IonInput, IonTextarea, 
  IonSelect, IonSelectOption, 
  IonRadioGroup, IonRadio, IonListHeader, 
  IonSegment, IonSegmentButton, IonPopover,
  IonThumbnail, IonFooter, IonText
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { add, trash, documentText, settings, create, options, camera, close, calendar } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html', // <-- Points to the correct HTML!
  standalone: true,
  imports: [CommonModule, FormsModule, IonHeader, IonToolbar, IonTitle,
    IonContent, IonList, IonItem, IonLabel, IonBadge, IonChip,
    IonFab, IonFabButton, IonIcon, IonSearchbar, IonButton,
    IonMenuButton, IonButtons, IonModal, IonInput, IonTextarea, 
    IonSelect, IonSelectOption, IonRadioGroup, IonRadio, IonListHeader,
    IonSegment, IonSegmentButton, IonPopover, IonThumbnail, IonFooter, IonText],
})
export class HomePage implements OnInit {
  searchTerm = '';
  notes: Note[] = [];
  selectedCategory = 'All'; 
  sortBy: 'newest' | 'oldest' = 'newest';

  isModalOpen = false;
  editingNoteId: string | null = null;
  newNoteTitle = '';
  newNoteContent = '';
  newNoteCategory: 'Personal' | 'Study' | 'Work' = 'Personal';
  newNoteImageUrl?: string; 
  newNoteLatitude?: number;
  newNoteLongitude?: number;
  newNoteLocationName?: string;

  isImageViewerOpen = false;
  viewerImageUrl: string | null = null;

  isViewModalOpen = false;
  viewingNote: Note | null = null;

  constructor(
    private toastCtrl: ToastController, 
    private alertCtrl: AlertController, 
    private notesService: NotesService
  ) {
    addIcons({ add, trash, documentText, settings, create, options, camera, close, calendar });
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
               dateStr.includes(term) || monthStr.includes(term); 
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

  openViewModal(note: Note) {
    this.viewingNote = note;
    this.isViewModalOpen = true;
  }

  openImageViewer(url: string) {
    this.viewerImageUrl = url;
    this.isImageViewerOpen = true;
  }

  async takePicture() {
    try {
      const { Camera, CameraResultType, CameraSource } = await import('@capacitor/camera');
      const { Geolocation } = await import('@capacitor/geolocation');

      const image = await Camera.getPhoto({
        quality: 80, allowEditing: false, resultType: CameraResultType.DataUrl, source: CameraSource.Prompt
      });
      this.newNoteImageUrl = image.dataUrl; 

      /* --- TEMPORARILY DISABLED FOR WEB TESTING ---
      try {
        const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 5000 });
        this.newNoteLatitude = pos.coords.latitude;
        this.newNoteLongitude = pos.coords.longitude;
        this.newNoteLocationName = await this.notesService.getLocationName(pos.coords.latitude, pos.coords.longitude);
      } catch (e) {
        console.log("Could not get location");
      }
      ----------------------------------------------- */

    } catch (error) {
      console.log('User cancelled taking a photo');
    }
  }

  async deleteNote(id: string) {
    const alert = await this.alertCtrl.create({
      header: 'Delete Note?',
      message: 'Are you sure you want to permanently delete this note?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete', role: 'destructive',
          handler: async () => {
            await this.notesService.deleteNote(id);
            this.notes = await this.notesService.getNotes(); 
            if (this.viewingNote?.id === id) {
              this.isViewModalOpen = false;
            }
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
    this.newNoteImageUrl = undefined;
    this.newNoteLatitude = undefined;
    this.newNoteLongitude = undefined;
    this.newNoteLocationName = undefined;
    this.isModalOpen = true;
  }

  openEditModal(note: Note) {
    this.editingNoteId = note.id;
    this.newNoteTitle = note.title;
    this.newNoteContent = note.content;
    this.newNoteCategory = note.category;
    this.newNoteImageUrl = note.imageUrl;
    this.newNoteLatitude = note.latitude;
    this.newNoteLongitude = note.longitude;
    this.newNoteLocationName = note.locationName;
    this.isViewModalOpen = false; 
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
      await this.notesService.updateNote(this.editingNoteId, this.newNoteTitle, this.newNoteContent, this.newNoteCategory, this.newNoteImageUrl, this.newNoteLatitude, this.newNoteLongitude, this.newNoteLocationName);
    } else {
      await this.notesService.addNote(this.newNoteTitle, this.newNoteContent, this.newNoteCategory, this.newNoteImageUrl, this.newNoteLatitude, this.newNoteLongitude, this.newNoteLocationName);
    }
    this.notes = await this.notesService.getNotes();
    this.isModalOpen = false;
    
    if (this.viewingNote && this.viewingNote.id === this.editingNoteId) {
      this.viewingNote = this.notes.find(n => n.id === this.editingNoteId) || null;
    }

    const toast = await this.toastCtrl.create({ message: this.editingNoteId ? 'Note updated!' : 'Note saved!', duration: 1500, color: 'success' });
    await toast.present();
  }
}