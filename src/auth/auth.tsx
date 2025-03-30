import React, { useState } from 'react';
import { auth } from '../../firebase'; // Importoi auth-instanssi
import { signInWithEmailAndPassword } from 'firebase/auth';

const Auth: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Kirjautuminen onnistui!');
    } catch (error) {
      console.error('Virhe kirjautumisessa:', error);
      alert('Virhe kirjautumisessa.');
    }
  };

  return (
    <div>
      <input type="email" placeholder="Sähköposti" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Salasana" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleSignIn}>Kirjaudu sisään</button>
    </div>
  );
};

export default Auth;