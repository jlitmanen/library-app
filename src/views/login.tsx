import React, { useState } from 'react';
import { Button, Form, Container, Row, Col } from 'react-bootstrap';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '../services/auth/authcontext';
import { useNavigate } from 'react-router-dom'; // Lisää useNavigate

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Lisää useNavigate hook

  const handleLogin = async () => {
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      navigate('/'); // Siirry etusivulle onnistuneen kirjautumisen jälkeen
    } catch (err: any) {
      console.error('Virhe kirjautumisessa:', err);
      setError(err.message);
    }
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md="6">
          <h2>Kirjaudu sisään</h2>
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
          {error && <p className="text-danger">{error}</p>}
          <Button variant="primary" onClick={handleLogin}>
            Kirjaudu
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;