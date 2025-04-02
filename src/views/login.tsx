import React, { useState } from 'react';
import { Button, Form, Container, Row, Col, Card } from 'react-bootstrap';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '../services/auth/authcontext';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useAuth();
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      navigate('/');
    } catch (err: any) {
      console.error('Virhe kirjautumisessa:', err);
      setError(err.message);
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Row className="justify-content-md-center" style={{ width: '100%', maxWidth: '400px' }}>
        <Col>
          <Card className="shadow">
            <Card.Body>
              <h2 className="text-center mb-4">Kirjaudu sisään</h2>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Sähköposti</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Syötä sähköposti"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Salasana</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Salasana"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
                {error && <p className="text-danger mb-3">{error}</p>}
                <Button variant="primary" className="w-100" onClick={handleLogin}>
                  Kirjaudu
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;