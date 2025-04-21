import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '../services/auth/authcontext';
import { loginAttemptTracker } from '../services/auth/loginAttempts';

interface LoginFormModalProps {
  show: boolean;
  onHide: () => void;
}

const LoginFormModal: React.FC<LoginFormModalProps> = ({ show, onHide }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useAuth();
  const [error, setError] = useState('');
  const [isLocked, setIsLocked] = useState(false);
  const [timeUntilReset, setTimeUntilReset] = useState(0);

  const updateLockStatus = () => {
    if (email) {
      const locked = !loginAttemptTracker.canAttemptLogin(email);
      setIsLocked(locked);
      if (locked) {
        const resetTime = loginAttemptTracker.getTimeUntilReset(email);
        setTimeUntilReset(resetTime);
      }
    }
  };

  const handleLogin = async () => {
    setError('');
    
    if (!email || !password) {
      setError('Syötä sekä sähköposti että salasana');
      return;
    }

    if (isLocked) {
      const minutes = Math.ceil(timeUntilReset / 60000);
      setError(`Liian monta kirjautumisyritystä. Yritä uudelleen ${minutes} minuutin kuluttua.`);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      onHide();
    } catch (err: any) {
      console.error('Virhe kirjautumisessa:', err);
      loginAttemptTracker.recordAttempt(email);
      updateLockStatus();
      
      if (isLocked) {
        const minutes = Math.ceil(timeUntilReset / 60000);
        setError(`Liian monta kirjautumisyritystä. Yritä uudelleen ${minutes} minuutin kuluttua.`);
      } else {
        const remainingAttempts = loginAttemptTracker.getRemainingAttempts(email);
        setError(`Virheelliset tunnukset. Yrityksiä jäljellä: ${remainingAttempts}`);
      }
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    updateLockStatus();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Kirjaudu sisään</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Sähköposti</Form.Label>
            <Form.Control 
              type="email" 
              placeholder="Syötä sähköposti" 
              value={email} 
              onChange={handleEmailChange}
              disabled={isLocked}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Salasana</Form.Label>
            <Form.Control 
              type="password" 
              placeholder="Salasana" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLocked}
            />
          </Form.Group>
        </Form>
        {error && <p className="text-danger mt-3">{error}</p>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Sulje
        </Button>
        <Button 
          variant="primary" 
          onClick={handleLogin}
          disabled={isLocked}
        >
          Kirjaudu
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LoginFormModal;