import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth } from '../../../firebase';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';

interface AuthContextProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => Promise<void>;
  loading: boolean; // Lisää loading tila
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  setUser: () => {},
  logout: async () => {},
  loading: true, // Aseta oletusarvoksi true
});

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Lisää loading tila

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false); // Aseta loading false, kun tila on määritetty
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Virhe uloskirjautumisessa:', error);
      alert('Virhe uloskirjautumisessa.');
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);