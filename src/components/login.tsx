import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '../services/auth/authcontext'; // Importoi useAuth hook

interface LoginFormModalProps {
  show: boolean;
  onHide: () => void;
}

const LoginFormModal: React.FC<LoginFormModalProps> = ({ show, onHide }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useAuth(); // Käytä setUser funktiota AuthContextista
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError(''); // Nollaa virheviesti ennen kirjautumista
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      onHide();
    } catch (err: any) {
      console.error('Virhe kirjautumisessa:', err);
      setError(err.message); // Aseta virheviesti
    }
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
            <Form.Control type="email" placeholder="Syötä sähköposti" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Form.Group>
          <Form.Group>
            <Form.Label>Salasana</Form.Label>
            <Form.Control type="password" placeholder="Salasana" value={password} onChange={(e) => setPassword(e.target.value)} />
          </Form.Group>
        </Form>
        {error && <p className="text-danger">{error}</p>} {/* Näytä virheviesti */}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Sulje
        </Button>
        <Button variant="primary" onClick={handleLogin}>
          Kirjaudu
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LoginFormModal;