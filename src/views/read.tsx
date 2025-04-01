import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../services/auth/authcontext';
import BookTable from '../components/table';
import { Book } from '../components/types';

const ReadBooks: React.FC = () => {
  const { user } = useAuth();
  const [readBooks, setReadBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchReadBooks = async () => {
      if (user) {
        const readCollection = collection(db, 'read');
        const q = query(readCollection, where('user', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const books: Book[] = querySnapshot.docs.map((doc) => doc.data().book);
        setReadBooks(books);
        setLoading(false);
      }
    };

    fetchReadBooks();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Luetut kirjat</h2>
      <BookTable data={readBooks} search={false} />
    </div>
  );
};

export default ReadBooks;