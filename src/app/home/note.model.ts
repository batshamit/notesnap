// note.model.ts — shared TypeScript interface used across all lessons
export interface Note {
  id: string;
  title: string;
  content: string;
  category: 'Personal' | 'Study' | 'Work';
  createdAt: Date;
}
