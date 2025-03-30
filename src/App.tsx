import { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

import { Form, FormControl } from 'react-bootstrap';

import BookTable from './components/table';

import { Book } from './components/types';
import { generateTestData } from './testdata';

import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID  
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  useEffect(() => {
    async function fetchData() {
      const querySnapshot = await getDocs(collection(db, 'books'));
      const booksData: Book[] = [];
      querySnapshot.forEach((doc) => {
        booksData.push({ id: doc.id, ...doc.data() } as Book);
      });
      setBooks(booksData);
    }
    // for testing
    const testData = generateTestData(1000); // Luo 100 000 kirjaa
    setBooks(testData);
    
    //fetchData();
  }, []);

  const filterBooks = () => {
    return books.filter((book) =>
      book.book.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(book.published).includes(searchTerm)
    );
  };

  return (
    <div>
      <Form className="d-flex mb-3">
        <FormControl
          type="search"
          placeholder="Hae kirjoja..."
          className="mr-2"
          aria-label="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form>
      <BookTable data={filterBooks()} />
    </div>
  );
}

export default App;