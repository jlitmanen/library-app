import React, { useState } from 'react';
import { Button, Form, Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '../services/auth/authcontext';
import { useNavigate } from 'react-router-dom';
import { loginAttemptTracker } from '../services/auth/loginAttempts'; // Oletetaan, että LoginAttemptTracker on tässä tiedostossa

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useAuth();
  const [error, setError] = useState('');
  const [loginBlocked, setLoginBlocked] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [timeUntilReset, setTimeUntilReset] = useState<number | null>(null);
  const navigate = useNavigate();

  const checkLoginAttempt = () => {
    if (!loginAttemptTracker.canAttemptLogin(email)) {
      setLoginBlocked(true);
      setRemainingAttempts(loginAttemptTracker.getRemainingAttempts(email));
      setTimeUntilReset(loginAttemptTracker.getTimeUntilReset(email));
      return false;
    }
    setLoginBlocked(false);
    setRemainingAttempts(null);
    setTimeUntilReset(null);
    return true;
  };

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('Sähköposti ja salasana vaaditaan.');
      return;
    }

    if (!checkLoginAttempt()) {
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      loginAttemptTracker.recordAttempt(email); // Kirjaa onnistunut yritys
      navigate('/');
    } catch (err: any) {
      console.error('Virhe kirjautumisessa:', err);
      setError(err.message);
      loginAttemptTracker.recordAttempt(email); // Kirjaa epäonnistunut yritys
      setRemainingAttempts(loginAttemptTracker.getRemainingAttempts(email));
      setTimeUntilReset(loginAttemptTracker.getTimeUntilReset(email));
      if (!loginAttemptTracker.canAttemptLogin(email)) {
        setLoginBlocked(true);
      }
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
      <Row className="justify-content-md-center" style={{ width: '100%', maxWidth: '400px' }}>
        <Col>
          <Card className="shadow">
            <Card.Body>
              <h2 className="text-center mb-4">Kirjaudu sisään</h2>
              {loginBlocked && (
                <Alert variant="danger" className="mb-3">
                  Liian monta epäonnistunutta kirjautumisyritystä.
                  {remainingAttempts !== null && (
                    <div>Jäljellä olevat yritykset: {remainingAttempts}</div>
                  )}
                  {timeUntilReset !== null && (
                    <div>Yritä uudelleen {Math.ceil(timeUntilReset / 1000)} sekunnin kuluttua.</div>
                  )}
                </Alert>
              )}
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Sähköposti</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Syötä sähköposti"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loginBlocked}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Salasana</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Salasana"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loginBlocked}
                  />
                </Form.Group>
                {error && <p className="text-danger mb-3">{error}</p>}
                <Button variant="primary" className="w-100" onClick={handleLogin} disabled={loginBlocked}>
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