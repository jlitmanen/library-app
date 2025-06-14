import { FaRegCircleXmark, FaCirclePlus, FaBars } from "react-icons/fa6";
import { Book } from "../types";
import { useState } from "react";

import './table.css';

export const BookTableRow: React.FC<{ book: Book, search: boolean, showActions: boolean, onSendBookToFirebase?: (book: Book) => void, openModal: (book: Book) => void, handleAddReadBook: (book: Book) => void }> = ({ book, search, showActions, onSendBookToFirebase, openModal, handleAddReadBook }) => {
    const [showMenu, setShowMenu] = useState(false);
  
    return (
      <tr key={book.id}>
      <td className="column-thumbnail">
        {book.thumbnail ? (
          <img
            src={book.thumbnail}
            alt={book.book}
            style={{ maxWidth: '50px', maxHeight: '75px' }}
          />
        ) : (
          <div style={{ alignContent: 'center' }} aria-describedby='not found'>
            <h1>
              <FaRegCircleXmark />
            </h1>
          </div>
        )}
      </td>
      <td className="column-title">{book.book}</td>
      <td className="column-author">{book.author}</td>
      <td className="column-published">{book.published}</td>
      <td className="column-isbn">{book.isbn}</td>
      <td className="column-actions">
        {search ? (
          <FaCirclePlus
            style={{ cursor: 'pointer', height: '20px' }}
            onClick={() => onSendBookToFirebase && onSendBookToFirebase(book)}
          />
        ) : (
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <FaBars
              style={{ cursor: 'pointer' }}
              onClick={() => setShowMenu(!showMenu)}
            />
            {showMenu && (
              <div style={{ position: 'absolute', border: '1px solid #ccc', padding: '10px', zIndex: 1, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}>
                <div style={{ cursor: 'pointer', marginBottom: '5px' }} onClick={() => { openModal(book); setShowMenu(false); }}>
                  Avaa Modal
                </div>
                {showActions && (
                  <div style={{ cursor: 'pointer' }} onClick={() => { handleAddReadBook(book); setShowMenu(false); }}>
                    Lisää luetuksi
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </td>
    </tr>
    );
  };
  