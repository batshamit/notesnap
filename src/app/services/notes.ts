import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Note } from '../home/note.model';

@Injectable({ providedIn: 'root' })
export class NotesService {
  private STORAGE_KEY = 'notesnap_notes';

  async getNotes(): Promise<Note[]> {
    const { value } = await Preferences.get({ key: this.STORAGE_KEY });
    if (!value) return [];
    // Re-attach Date objects (JSON.parse gives strings)
    const notes = JSON.parse(value) as Note[];
    return notes.map(n => ({ ...n, createdAt: new Date(n.createdAt) }));
  }

  async saveNotes(notes: Note[]): Promise<void> {
    await Preferences.set({ key: this.STORAGE_KEY, value: JSON.stringify(notes) });
  }


  // 1. THE NEW REVERSE GEOCODING TRANSLATOR
  async getLocationName(lat: number, lng: number): Promise<string> {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
      const data = await response.json();
      const city = data.address.city || data.address.town || data.address.state || 'Unknown City';
      const country = data.address.country || '';
      return `${city}, ${country}`;
    } catch (e) {
      return 'Location Unknown';
    }
  }

  // 2. UPDATE ADD NOTE
  async addNote(title: string, content: string, category: Note['category'], imageUrl?: string, latitude?: number, longitude?: number, locationName?: string): Promise<Note> {
    const notes = await this.getNotes();
    const newNote: Note = {
      id: Date.now().toString(),
      title, content, category,
      imageUrl, latitude, longitude, locationName, // <-- Save the new data
      createdAt: new Date(),
    };
    notes.push(newNote);
    await this.saveNotes(notes);
    return newNote;
  }

  // 3. UPDATE UPDATE NOTE
  async updateNote(id: string, title: string, content: string, category: Note['category'], imageUrl?: string, latitude?: number, longitude?: number, locationName?: string): Promise<void> {
    const notes = await this.getNotes();
    const index = notes.findIndex(n => n.id === id);
    if (index > -1) {
      notes[index] = { ...notes[index], title, content, category, imageUrl, latitude, longitude, locationName }; // <-- Save the new data
      await this.saveNotes(notes);
    }
  }

  // // 1. Update addNote to accept the optional imageUrl
  // async addNote(title: string, content: string, category: Note['category'], imageUrl?: string): Promise<Note> {
  //   const notes = await this.getNotes();
  //   const newNote: Note = {
  //     id: Date.now().toString(),
  //     title, content, category,
  //     imageUrl, // <-- Save the image!
  //     createdAt: new Date(),
  //   };
  //   notes.push(newNote);
  //   await this.saveNotes(notes);
  //   return newNote;
  // }

  // // ==========================================
  // // THIS IS THE NEW METHOD IT WAS LOOKING FOR!
  // // ==========================================
  // // 2. Update updateNote to accept the optional imageUrl
  // async updateNote(id: string, title: string, content: string, category: Note['category'], imageUrl?: string): Promise<void> {
  //   const notes = await this.getNotes();
  //   const index = notes.findIndex(n => n.id === id);
  //   if (index > -1) {
  //     notes[index] = { ...notes[index], title, content, category, imageUrl }; // <-- Save the image!
  //     await this.saveNotes(notes);
  //   }
  // }

  async deleteNote(id: string): Promise<void> {
    const notes = await this.getNotes();
    await this.saveNotes(notes.filter(n => n.id !== id));
  }

  async clearAll(): Promise<void> {
    await Preferences.remove({ key: this.STORAGE_KEY });
  }

  async getNoteCount(): Promise<number> {
    return (await this.getNotes()).length;
  }
}