import React, { ChangeEvent, FormEvent } from 'react';
import { parameters, filters, orders } from '../constants/index';
import { Form, FormControl, FormGroup, FormSelect, Button, Spinner } from 'react-bootstrap';

interface SearchFormProps {
  searchTerm: string;
  searchParameter: string;
  searchFilter: string;
  searchOrder: string;
  isLoading: boolean;
  onSearchTermChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onParameterChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  onFilterChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  onOrderChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  onSearchSubmit: (event: FormEvent) => void;
  onClearSearch: () => void;
}

const SearchForm: React.FC<SearchFormProps> = ({
  searchTerm,
  searchParameter,
  searchFilter,
  searchOrder,
  isLoading,
  onSearchTermChange,
  onParameterChange,
  onFilterChange,
  onOrderChange,
  onSearchSubmit,
  onClearSearch,
}) => {
  return (
    <Form onSubmit={onSearchSubmit}>
      <FormGroup className="mb-3">
        <FormControl type="text" placeholder="Hakusana" value={searchTerm} onChange={onSearchTermChange} />
      </FormGroup>
      <FormGroup className="mb-3">
        <FormSelect value={searchParameter} onChange={onParameterChange}>
          {Object.entries(parameters).map(([key, value]) => (
            <option key={key} value={value}>
              {key}
            </option>
          ))}
        </FormSelect>
      </FormGroup>
      <FormGroup className="mb-3">
        <FormSelect value={searchFilter} onChange={onFilterChange}>
          {Object.entries(filters).map(([key, value]) => (
            <option key={key} value={value}>
              {key}
            </option>
          ))}
        </FormSelect>
      </FormGroup>
      <FormGroup className="mb-3">
        <FormSelect value={searchOrder} onChange={onOrderChange}>
          {Object.entries(orders).map(([key, value]) => (
            <option key={key} value={value}>
              {key}
            </option>
          ))}
        </FormSelect>
      </FormGroup>
      <Button variant="primary" type="submit" disabled={isLoading}>
        {isLoading ? <Spinner animation="border" size="sm" /> : 'Hae'}
      </Button>
      <Button variant="secondary" type="button" onClick={onClearSearch} disabled={isLoading}>
        Tyhjennä
      </Button>
    </Form>
  );
};

export default SearchForm;