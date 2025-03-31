import { useEffect, useState } from 'react';
import { Form, FormControl, Row, Col, Container } from 'react-bootstrap';
import BookTable from '../components/table';
import { Book } from '../components/types';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../services/auth/authcontext';
import BookService from '../services/bookservice'; // Tuo BookService

function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const bookService = new BookService(); // Luo BookService-instanssi

  useEffect(() => {
    async function fetchData() {
      const fetchedBooks = await bookService.fetchBooks(user);
      setBooks(fetchedBooks);
    }

    fetchData();
  }, [user, bookService]); // Lisää bookService riippuvuudeksi

  const filteredBooks = bookService.filterBooks(books, searchTerm);

  return (
    <Container>
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
            <BookTable data={filteredBooks} search={false} />
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;