import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { Book } from '../components/types';
import { User } from 'firebase/auth';

class BookService {
  async fetchBooks(user: User | null): Promise<Book[]> {
    if (user) {
      try {
        const querySnapshot = await getDocs(collection(db, 'books'));
        const booksData: Book[] = [];
        querySnapshot.forEach((doc) => {
          booksData.push({ id: doc.id, ...doc.data() } as Book);
        });
        return booksData;
      } catch (error) {
        console.error('Virhe kirjojen haussa:', error);
        throw error;
      }
    } else {
      return [];
    }
  }

  filterBooks(books: Book[], searchTerm: string): Book[] {
    const trimmedSearchTerm = searchTerm.trim().toLowerCase();
    return books.filter((book) =>
      book.book.toLowerCase().includes(trimmedSearchTerm) ||
      book.author.toLowerCase().includes(trimmedSearchTerm) ||
      book.isbn.toLowerCase().includes(trimmedSearchTerm) ||
      String(book.published).includes(trimmedSearchTerm)
    );
  }
}

export default BookService;