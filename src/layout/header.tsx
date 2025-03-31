import React, { useState } from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import LoginFormModal from '../components/login';
import { useAuth } from '../services/auth/authcontext';

const Header: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [expanded, setExpanded] = useState(false); // Lisää tila valikon laajentamiselle
  const { user, logout } = useAuth();

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" expanded={expanded}>
      <Container>
        <Navbar.Brand href="/" onClick={() => setExpanded(false)}>JE Library</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" onClick={handleToggle} />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/search" onClick={() => setExpanded(false)}>Haku</Nav.Link>
          </Nav>
          {user ? (
            <div>
              <Navbar.Text className="me-2">
                {user.email}
              </Navbar.Text>
              <Button variant="outline-light" onClick={() => { logout(); setExpanded(false); }}>Kirjaudu ulos</Button>
            </div>
          ) : (
            <Button variant="outline-light" onClick={() => setShowLoginModal(true)}>Kirjaudu sisään</Button>
          )}
        </Navbar.Collapse>
        <LoginFormModal show={showLoginModal} onHide={() => setShowLoginModal(false)} />
      </Container>
    </Navbar>
  );
};

export default Header;