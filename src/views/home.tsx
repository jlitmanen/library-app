import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { Form, FormControl, Row, Col } from 'react-bootstrap';
import BookTable from '../components/table';
import { Book } from '../components/types';
//import { generateTestData } from './testdata';
import  { db } from '../../firebase'
import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

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
    //const testData = generateTestData(1000); // Luo 100 000 kirjaa
    //setBooks(testData);

    fetchData();
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
    <Row>
      <Col>
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
      </Col>
    </Row>
  );
}

export default Home;