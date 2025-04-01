import React, { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Book } from './types';
import PaginationComponent from './pagination';
import ModalComponent from './modal';
import { db } from '../../firebase'; // Tuo Firestore-instanssi
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../services/auth/authcontext'; // Tuo useAuth-hook

interface BookTableProps {
  data: Book[];
  search?: boolean;
  onSendBookToFirebase?: (book: Book) => void;
}

const BookTable: React.FC<BookTableProps> = ({ data, search = false, onSendBookToFirebase }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage, setBooksPerPage] = useState(5);
  const maxPageNumbers = 5;
  const { user } = useAuth(); // Käytä useAuth-hookkia

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

  const handleAddReadBook = async (book: Book) => {
    if (!user) {
      alert('Kirjaudu sisään lisätäksesi kirjan luetuksi.');
      return;
    }

    try {
      await addDoc(collection(db, 'read'), {
        user: user.uid,
        book: book,
      });
      alert('Kirja lisätty luettuihin kirjoihin.');
    } catch (error) {
      console.error('Virhe kirjan lisäämisessä luettuihin kirjoihin:', error);
      alert('Virhe kirjan lisäämisessä luettuihin kirjoihin.');
    }
  };

  if (data.length === 0) {
    return <p>Kirjaudu sisään nähdäksesi kirjat!</p>;
  }

  return (
    <>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Kuva</th>
            <th>Otsikko</th>
            <th>Tekijä</th>
            <th>Vuosi</th>
            <th>ISBN</th>
            <th>Toiminnot</th>
          </tr>
        </thead>
        <tbody>
          {currentBooks.map((book) => (
            <tr key={book.id}>
              <td>
                {book.thumbnail ? (
                  <img
                    src={book.thumbnail}
                    alt={book.book}
                    style={{ maxWidth: '50px', maxHeight: '75px' }}
                  />
                ) : (
                  <div style={{ width: '50px', height: '75px' }}></div>
                )}
              </td>
              <td>{book.book}</td>
              <td>{book.author}</td>
              <td>{book.published}</td>
              <td>{book.isbn}</td>
              <td>
                {search ? (
                  <Button variant="success" size="sm" onClick={() => onSendBookToFirebase && onSendBookToFirebase(book)}>
                    Lähetä
                  </Button>
                ) : (
                  <>
                    <Button variant="primary" size="sm" onClick={() => openModal(book)}>
                      Lisätiedot
                    </Button>
                    <Button variant="info" size="sm" onClick={() => handleAddReadBook(book)}>
                      Lisää luetuksi
                    </Button>
                  </>
                )}
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