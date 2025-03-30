import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Book } from './types';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  book?: Book;
}

const ModalComponent: React.FC<ModalProps> = ({ show, onClose, book }) => {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Lisätiedot</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {book && (
          <div>
            <p><strong>Otsikko:</strong> {book.book}</p>
            <p><strong>Tekijä:</strong> {book.author}</p>
            <p><strong>Vuosi:</strong> {book.published}</p>
            <p><strong>ISBN:</strong> {book.isbn}</p>
            <p><strong>Kuvaus:</strong> {book.description}</p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Sulje
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalComponent;