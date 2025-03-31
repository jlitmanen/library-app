import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { booksSearch } from '../constants/index';
import { Book } from '../components/types';

class BookSearchService {
  async searchBooks(
    searchTerm: string,
    searchParameter: string, // Säilytä tyyppi
    searchFilter: string,
    searchOrder: string
  ): Promise<Book[]> {
    try {
      const url = booksSearch(searchParameter, searchFilter, searchOrder, searchTerm);
      const response = await fetch(url);
      const data = await response.json();

      if (data.items) {
        return data.items.map((item: any) => ({
          id: item.id,
          book: item.volumeInfo.title,
          author: item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Tuntematon tekijä',
          published: item.volumeInfo.publishedDate,
          isbn: item.volumeInfo.industryIdentifiers ? item.volumeInfo.industryIdentifiers.map((identifier: any) => identifier.identifier).join(', ') : 'Ei ISBN:ää',
          description: item.volumeInfo.description,
          thumbnail: item.volumeInfo.imageLinks?.thumbnail,
        }));
      } else {
        return [];
      }
    } catch (error) {
      console.error('Virhe haussa:', error);
      return [];
    }
  }

  async sendBookToFirebase(book: Book): Promise<void> {
    try {
      const booksCollection = collection(db, 'books');
      await addDoc(booksCollection, {
        id: book.id,
        author: book.author,
        book: book.book,
        description: book.description ? book.description : '',
        isbn: book.isbn,
        published: book.published,
      });
      alert('Kirja lähetetty Firebaseen onnistuneesti!');
    } catch (error) {
      console.error('Virhe kirjan lähettämisessä Firebaseen:', error);
      alert('Virhe kirjan lähettämisessä Firebaseen.');
    }
  }
}

export default BookSearchService;