import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../../firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';

interface AuthContextProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => Promise<void>; // Lisää logout funktio
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  setUser: () => {},
  logout: async () => {}, // Lisää tyhjä funktio oletusarvoksi
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null); // Päivitä käyttäjän tila
    } catch (error) {
      console.error('Virhe uloskirjautumisessa:', error);
      alert('Virhe uloskirjautumisessa.');
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);