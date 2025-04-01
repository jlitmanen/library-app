import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { booksSearch } from '../constants/index';
import { Book } from '../components/types';

class BookSearchService {
  async searchBooks(
    searchTerm: string,
    searchParameter: string,
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
        const bookData = {
            id: book.id,
            author: book.author,
            book: book.book,
            description: book.description ? book.description : '',
            isbn: book.isbn,
            published: book.published,
            thumbnail: book.thumbnail || null, // Käytä null, jos thumbnail on undefined
        };
        await addDoc(booksCollection, bookData);
        console.log('Kirja lähetetty Firebaseen onnistuneesti!');
        // Käyttäjäystävällisempi ilmoitus tähän.
    } catch (error: any) {
        console.error('Virhe kirjan lähettämisessä Firebaseen:', error);
        if (error.code === 'permission-denied') {
            // Tietokantaoikeudet puuttuvat
            console.error('Käyttäjällä ei ole oikeuksia lähettää tietoja Firebaseen.');
            // Käyttäjäystävällinen virhe ilmoitus.
        } else if (error.code === 'unavailable') {
          // Verkkoyhteys virhe.
          console.error('Verkkoyhteys virhe.');
          //käyttäjäystävällinen virheilmoitus
        } else {
            // Muu virhe
            console.error('Odottamaton virhe tapahtui.');
            //käyttäjäystävällinen virheilmoitus
        }
    }
}

}

export default BookSearchService;