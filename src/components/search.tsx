import React, { useState, ChangeEvent, FormEvent } from 'react';
import { parameters, filters, orders } from '../constants/index';
import { Book } from './types';
import { Container, Col, Row, Spinner } from 'react-bootstrap';
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
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
    try {
      const books = await bookService.searchBooks(searchTerm, searchParameter, searchFilter, searchOrder);
      setSearchResults(books);
    } finally {
      setIsLoading(false);
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
            isLoading={isLoading}
            onSearchTermChange={handleSearchTermChange}
            onParameterChange={handleParameterChange}
            onFilterChange={handleFilterChange}
            onOrderChange={handleOrderChange}
            onSearchSubmit={handleSearchSubmit}
            onClearSearch={handleClearSearch}
          />
        </Col>
        <Col sm={8}>
          {isLoading && (
            <div className="text-center">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Ladataan...</span>
              </Spinner>
            </div>
          )}
          {searchResults.length > 0 && !isLoading && (
            <BookTable data={searchResults} search={true} onSendBookToFirebase={handleSendBookToFirebase} />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default SearchComponent;