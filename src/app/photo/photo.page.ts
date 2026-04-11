import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';
import { Share } from '@capacitor/share';
import { Clipboard } from '@capacitor/clipboard';
import { NotesService } from '../services/notes'; // <-- Fixed the import for you!
import { Note } from '../home/note.model';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonFab, IonFabButton,
  IonIcon, IonCard, IonCardContent, IonImg, IonText, IonGrid, IonRow,
  IonCol, IonButton, IonButtons, IonMenuButton, 
  ActionSheetController, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { camera, trash, image, close, share, copy } from 'ionicons/icons';

@Component({
  selector: 'app-photo',
  templateUrl: 'photo.page.html', // <-- Points to the correct HTML!
  standalone: true,
  imports: [CommonModule, IonHeader, IonToolbar, IonTitle, IonContent,
    IonFab, IonFabButton, IonIcon, IonCard, IonCardContent, IonImg,
    IonText, IonGrid, IonRow, IonCol, IonButton, IonButtons, IonMenuButton],
})
export class PhotoPage {
  galleryNotes: Note[] = [];
  isLoading = false;

  constructor(
    private notesService: NotesService,
    private actionSheetCtrl: ActionSheetController,
    private toastCtrl: ToastController
  ) { 
    addIcons({ camera, trash, image, close, share, copy }); 
  }

  async ionViewWillEnter() {
    await this.loadGallery();
  }

  async loadGallery() {
    const allNotes = await this.notesService.getNotes();
    this.galleryNotes = allNotes
      .filter(note => note.imageUrl)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async presentCameraOptions() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Add a Photo',
      subHeader: 'Choose a source to add to your gallery',
      buttons: [
        {
          text: 'Take Photo',
          icon: 'camera',
          handler: () => { this.processPhoto(CameraSource.Camera); }
        },
        {
          text: 'Choose from Gallery',
          icon: 'image',
          handler: () => { this.processPhoto(CameraSource.Photos); }
        },
        {
          text: 'Cancel',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });
    await actionSheet.present();
  }

  async processPhoto(source: CameraSource) {
    this.isLoading = true;
    try {
      const capturedImage = await Camera.getPhoto({
        quality: 90, 
        allowEditing: false, 
        resultType: CameraResultType.DataUrl, 
        source: source 
      });

      let lat: number | undefined;
      let lng: number | undefined;
      let locName: string | undefined;

      try {
        const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 5000 });
        lat = pos.coords.latitude;
        lng = pos.coords.longitude;
        locName = await this.notesService.getLocationName(lat, lng);
      } catch (e) {
        console.log('Location bypass/error during capture.');
      }

      if (capturedImage.dataUrl) {
        await this.notesService.addNote('Gallery Photo', 'Saved from the Photo Gallery', 'Personal', capturedImage.dataUrl, lat, lng, locName);
        await this.loadGallery();
      }
    } catch (err: any) {
      if (err.message !== 'User cancelled photos app') console.error(err);
    } finally {
      this.isLoading = false;
    }
  }

  async removePhoto(id: string) { 
    await this.notesService.deleteNote(id);
    await this.loadGallery();
  }

  openInMaps(lat: number, lng: number) {
    // We replaced the broken syllabus link with the real Google Maps link!
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  }

  async sharePhoto(note: Note) {
    try {
      await Share.share({
        title: note.title,
        text: 'Check out this photo I saved in NoteSnap!',
        url: note.imageUrl, 
        dialogTitle: 'Share your photo',
      });
    } catch (err) {
      // If the web browser blocks the share, let the user know!
      const toast = await this.toastCtrl.create({
        message: 'Native sharing is only available on the installed mobile app!',
        duration: 2000,
        color: 'warning',
        position: 'bottom'
      });
      await toast.present();
    }
  }

  async copyCoordinates(lat: number, lng: number) {
    const coords = `${lat}, ${lng}`;
    await Clipboard.write({ string: coords });
    
    const toast = await this.toastCtrl.create({
      message: 'Coordinates copied to clipboard!',
      duration: 1500,
      color: 'success',
      position: 'bottom'
    });
    await toast.present();
  }
}