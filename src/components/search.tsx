import React, { useState, ChangeEvent, FormEvent } from 'react';
import { booksSearch, parameters, filters, orders } from '../constants/index';
import { Book } from './types';
import { Table, Button, Form, FormControl, FormLabel, FormGroup, FormSelect, Container, Col, Row } from 'react-bootstrap';
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';

interface SearchComponentProps {
  onBooksFound: (books: Book[]) => void;
}

const SearchComponent: React.FC<SearchComponentProps> = ({ onBooksFound }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParameter, setSearchParameter] = useState(parameters.title);
  const [searchFilter, setSearchFilter] = useState(filters.all);
  const [searchOrder, setSearchOrder] = useState(orders.relevance);
  const [searchResults, setSearchResults] = useState<Book[]>([]);

  const handleSearchTermChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleParameterChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSearchParameter(event.target.value as keyof typeof parameters);
  };

  const handleFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSearchFilter(event.target.value as keyof typeof filters);
  };

  const handleOrderChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSearchOrder(event.target.value as keyof typeof orders);
  };

  const handleSearchSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const url = booksSearch(searchParameter, searchFilter, searchOrder, searchTerm);
      const response = await fetch(url);
      const data = await response.json();

      if (data.items) {
        const books = data.items.map((item: any) => ({
          id: item.id,
          book: item.volumeInfo.title,
          author: item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Tuntematon tekijä',
          published: item.volumeInfo.publishedDate,
          isbn: item.volumeInfo.industryIdentifiers ? item.volumeInfo.industryIdentifiers.map((identifier: any) => identifier.identifier).join(', ') : 'Ei ISBN:ää',
          description: item.volumeInfo.description,
          thumbnail: item.volumeInfo.imageLinks?.thumbnail,
        }));
        setSearchResults(books);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Virhe haussa:', error);
      setSearchResults([]);
    }
  };

  const handleSendBookToFirebase = async (book: Book) => {
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
  };

  return (
    <Container>
      <Row>
        <Col sm={2}>
          <Form onSubmit={handleSearchSubmit}>
            <FormGroup className="mb-3">
              <FormControl type="text" placeholder='Hakusana' value={searchTerm} onChange={handleSearchTermChange} />
            </FormGroup>
            <FormGroup className="mb-3">
              <FormSelect value={searchParameter} onChange={handleParameterChange}>
                {Object.entries(parameters).map(([key, value]) => (
                  <option key={key} value={value}>
                    {key}
                  </option>
                ))}
              </FormSelect>
            </FormGroup>
            <FormGroup className="mb-3">
              <FormSelect value={searchFilter} onChange={handleFilterChange}>
                {Object.entries(filters).map(([key, value]) => (
                  <option key={key} value={value}>
                    {key}
                  </option>
                ))}
              </FormSelect>
            </FormGroup>
            <FormGroup className="mb-3">
              <FormSelect value={searchOrder} onChange={handleOrderChange}>
                {Object.entries(orders).map(([key, value]) => (
                  <option key={key} value={value}>
                    {key}
                  </option>
                ))}
              </FormSelect>
            </FormGroup>
            <Button variant="primary" type="submit">Hae</Button>
          </Form>
      </Col>
      <Col sm={8}>
        {searchResults.length > 0 && (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Otsikko</th>
                <th>Tekijä</th>
                <th>Julkaisuvuosi</th>
                <th>ISBN</th>
                <th>Toiminnot</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((book) => (
                <tr key={book.id}>
                  <td>{book.book}</td>
                  <td>{book.author}</td>
                  <td>{book.published}</td>
                  <td>{book.isbn}</td>
                  <td>
                    <Button variant="success" onClick={() => handleSendBookToFirebase(book)}>Lähetä</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        </Col>
      </Row>
    </Container>
  );
};

export default SearchComponent;