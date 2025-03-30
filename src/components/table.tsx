import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Book } from './types';
import PaginationComponent from './pagination';
import ModalComponent from './modal';

interface BookTableProps {
  data: Book[];
}

const BookTable: React.FC<BookTableProps> = ({ data }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage, setBooksPerPage] = useState(5);
  const maxPageNumbers = 5;

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = data.slice(indexOfFirstBook, indexOfLastBook);

  const totalPages = Math.ceil(data.length / booksPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const openModal = (book: Book) => {
    setSelectedBook(book);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedBook(undefined);
  };

  const handleBooksPerPageChange = (booksPerPage: number) => {
    setBooksPerPage(booksPerPage);
    setCurrentPage(1);
  };

  if (data.length === 0) {
    return <p>Kirjaudu sisään nähdäksesi kirjat!</p>;
  }

  return (
    <>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Otsikko</th>
            <th>Tekijä</th>
            <th>Vuosi</th>
            <th>ISBN</th>
            <th>Lisätiedot</th>
          </tr>
        </thead>
        <tbody>
          {currentBooks.map((book) => (
            <tr key={book.id}>
              <td>{book.book}</td>
              <td>{book.author}</td>
              <td>{book.published}</td>
              <td>{book.isbn}</td>
              <td>
                <Button variant="primary" size="sm" onClick={() => openModal(book)}>
                  Lisätiedot
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        maxPageNumbers={maxPageNumbers}
        onPageChange={paginate}
        booksPerPage={booksPerPage}
        onBooksPerPageChange={handleBooksPerPageChange}
      />

      <ModalComponent show={modalOpen} onClose={closeModal} book={selectedBook} />
    </>
  );
};

export default BookTable;