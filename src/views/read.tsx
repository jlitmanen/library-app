import React, { useState, useEffect } from 'react';
import { db } from '../../firebase';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { useAuth } from '../services/auth/authcontext';
import { Book } from '../components/types';
import BookTable from '../components/css/table';

const ReadBooks: React.FC = () => {
  const { user } = useAuth();
  const [readBooks, setReadBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchReadBooks = async () => {
      if (user) {
        const readCollection = collection(db, 'reads');
        const q = query(readCollection, where('user', '==', user.uid));
        const querySnapshot = await getDocs(q);

        const booksWithDetails: Book[] = [];

        for (const docSnapshot of querySnapshot.docs) {
          const readData = docSnapshot.data();

          if (readData.book) {
            // Tarkista, onko readData.book viittaus vai kirjan tiedot
            if (readData.book.path) {
              // readData.book on viittaus books-kokoelmaan
              // Hae kirjan tiedot viittauksesta
              try {
                const bookSnapshot = await getDoc(doc(db, readData.book.path));
                if (bookSnapshot.exists()) {
                  booksWithDetails.push({ id: bookSnapshot.id, ...bookSnapshot.data() } as Book);
                }
              } catch (error) {
                console.error("Virhe kirjan haussa:", error);
              }

            } else {
              // readData.book sisältää kirjan tiedot suoraan
              booksWithDetails.push(readData.book as Book);
            }
          } else {
            console.warn('Virheellinen kirjan viittaus:', readData);
          }
        }

        setReadBooks(booksWithDetails);
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
      <BookTable data={readBooks} search={false} showActions={false} />
    </div>
  );
};

export default ReadBooks;