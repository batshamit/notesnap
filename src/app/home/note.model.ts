export interface Note {
  id: string;
  title: string;
  content: string;
  category: 'Personal' | 'Study' | 'Work';
  createdAt: Date;
  imageUrl?: string; 
  latitude?: number;  
  longitude?: number; 
  locationName?: string; // <-- NEW: The City and Country
}