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

  async addNote(title: string, content: string, category: Note['category']): Promise<Note> {
    const notes = await this.getNotes();
    const newNote: Note = {
      id: Date.now().toString(),
      title, content, category,
      createdAt: new Date(),
    };
    notes.push(newNote);
    await this.saveNotes(notes);
    return newNote;
  }

  // ==========================================
  // THIS IS THE NEW METHOD IT WAS LOOKING FOR!
  // ==========================================
  async updateNote(id: string, title: string, content: string, category: Note['category']): Promise<void> {
    const notes = await this.getNotes();
    const index = notes.findIndex(n => n.id === id);
    if (index > -1) {
      notes[index] = { ...notes[index], title, content, category };
      await this.saveNotes(notes);
    }
  }

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