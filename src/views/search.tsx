// About.tsx
import React from 'react';
import SearchComponent from '../components/search';
import { useAuth } from '../services/auth/authcontext';


const Search: React.FC = () => {
    const { user } = useAuth(); // Käytä useAuth hookia
    return (
    <div>
      {user ? (
          <SearchComponent />
        ) : (<></>)}
    </div>
  );
};

export default Search;