import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { Book } from '../components/types';
import { User } from 'firebase/auth';

class BookService {
  async fetchBooks(user: User | null): Promise<Book[]> {
    if (user) {
      const querySnapshot = await getDocs(collection(db, 'books'));
      const booksData: Book[] = [];
      querySnapshot.forEach((doc) => {
        booksData.push({ id: doc.id, ...doc.data() } as Book);
      });
      return booksData;
    } else {
      return [];
    }
  }

  filterBooks(books: Book[], searchTerm: string): Book[] {
    return books.filter((book) =>
      book.book.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(book.published).includes(searchTerm)
    );
  }
}

export default BookService;