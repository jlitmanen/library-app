// About.tsx
import React, { useState } from 'react';
import SearchComponent from '../components/search';
import { Book } from '../components/types';
import { useAuth } from '../auth/authcontext';


const Search: React.FC = () => {
    const { user } = useAuth(); // Käytä useAuth hookia
    const [searchedBooks, setSearchedBooks] = useState<Book[]>([]); // Uusi tila hakutuloksille
    const handleBooksFound = (books: Book[]) => {
        setSearchedBooks(books);
      };

    return (
    <div>
      {user ? (
          <SearchComponent onBooksFound={handleBooksFound} />
        ) : (<></>)}
    </div>
  );
};

export default Search;