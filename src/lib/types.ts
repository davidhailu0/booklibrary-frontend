export interface Book {
  id: string;
  title: string;
  author: string;
  isbn?: string;
  coverUrl?: string;
  rating?: number;
  isRead: boolean;
  notes?: string;
  created_at?: string;
}

export interface OpenLibraryBook {
  title: string;
  author_name?: string[];
  isbn?: string[];
  cover_i?: number;
}