import React, { ChangeEvent, ChangeEventHandler } from 'react';
import Pagination from 'react-bootstrap/Pagination';
import Form from 'react-bootstrap/Form';
import { FormControl } from 'react-bootstrap';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    maxPageNumbers: number;
    onPageChange: (pageNumber: number) => void;
    booksPerPage: number;
    onBooksPerPageChange: (booksPerPage: number) => void;
  }


  const PaginationComponent: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    maxPageNumbers,
    onPageChange,
    booksPerPage,
    onBooksPerPageChange,
  }) => {
  const renderPageNumbers = () => {
    const pageNumbers = [];

    if (totalPages <= maxPageNumbers) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(
          <Pagination.Item key={i} active={i === currentPage} onClick={() => onPageChange(i)}>
            {i}
          </Pagination.Item>
        );
      }
    } else {
      let startPage = Math.max(1, currentPage - Math.floor(maxPageNumbers / 2));
      let endPage = Math.min(totalPages, startPage + maxPageNumbers - 1);

      if (endPage - startPage + 1 < maxPageNumbers) {
        startPage = Math.max(1, endPage - maxPageNumbers + 1);
      }

      if (startPage > 1) {
        pageNumbers.push(
          <Pagination.Item key="1" onClick={() => onPageChange(1)}>
            1
          </Pagination.Item>
        );
        if (startPage > 2) {
          pageNumbers.push(<Pagination.Ellipsis key="ellipsisStart" />);
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(
          <Pagination.Item key={i} active={i === currentPage} onClick={() => onPageChange(i)}>
            {i}
          </Pagination.Item>
        );
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageNumbers.push(<Pagination.Ellipsis key="ellipsisEnd" />);
        }
        pageNumbers.push(
          <Pagination.Item key={totalPages} onClick={() => onPageChange(totalPages)}>
            {totalPages}
          </Pagination.Item>
        );
      }
    }
    return pageNumbers;
  };


  const handleBooksPerPageChange = (event: any) => {
    onBooksPerPageChange(Number((event.target as HTMLSelectElement).value));
  };

  return (
    <>
      <Form.Group>
        <Form.Label>Teoksia per sivu:</Form.Label>
        <FormControl
          as="select"
          value={booksPerPage}
          onChange={handleBooksPerPageChange}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={100}>100</option>
        </FormControl>
      </Form.Group>

      <Pagination>
        <Pagination.First onClick={() => onPageChange(1)} disabled={currentPage === 1} />
        <Pagination.Prev onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} />
        {renderPageNumbers()}
        <Pagination.Next onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} />
        <Pagination.Last onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} />
      </Pagination>
    </>
  );
};

export default PaginationComponent;