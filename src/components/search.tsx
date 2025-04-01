import React, { useState, ChangeEvent, FormEvent } from 'react';
import { parameters, filters, orders } from '../constants/index';
import { Book } from './types';
import { Container, Col, Row } from 'react-bootstrap';
import BookSearchService from '../services/booksearchservice';
import BookTable from './table';
import SearchForm from './searchform';


interface SearchComponentProps {}

const SearchComponent: React.FC<SearchComponentProps> = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParameter, setSearchParameter] = useState(parameters.title);
  const [searchFilter, setSearchFilter] = useState(filters.all);
  const [searchOrder, setSearchOrder] = useState(orders.relevance);
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Lisää lataustila
  const bookService = new BookSearchService();

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
    setIsLoading(true); // Aseta lataustila true
    try {
      const books = await bookService.searchBooks(searchTerm, searchParameter, searchFilter, searchOrder);
      setSearchResults(books);
    } catch (error:any) {
      console.error('Virhe haussa:', error);
      // Näytä virheviesti käyttäjälle
      alert('Haku epäonnistui: ' + error.message);
    } finally {
      setIsLoading(false); // Aseta lataustila false
    }
  };

  const handleSendBookToFirebase = async (book: Book) => {
    await bookService.sendBookToFirebase(book);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
  };

  return (
    <Container>
      <Row>
        <Col sm={4}>
          <SearchForm
            searchTerm={searchTerm}
            searchParameter={searchParameter}
            searchFilter={searchFilter}
            searchOrder={searchOrder}
            onSearchTermChange={handleSearchTermChange}
            onParameterChange={handleParameterChange}
            onFilterChange={handleFilterChange}
            onOrderChange={handleOrderChange}
            onSearchSubmit={handleSearchSubmit}
            onClearSearch={handleClearSearch}
            isLoading={isLoading}
          />
        </Col>
        <Col sm={8}>
          {searchResults.length > 0 && (
            <BookTable data={searchResults} search={true} onSendBookToFirebase={handleSendBookToFirebase} />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default SearchComponent;