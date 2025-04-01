import React, { memo } from 'react';
import SearchComponent from '../components/search';
import { useAuth } from '../services/auth/authcontext';

const Search: React.FC = memo(() => {
    const { user } = useAuth();
    return (
        <div>
            {user ? (
                <SearchComponent />
            ) : (<></>)}
        </div>
    );
});

export default Search;