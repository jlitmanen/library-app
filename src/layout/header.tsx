import React from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { useAuth } from '../services/auth/authcontext';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/">JE Library</Navbar.Brand>
        {user && (
          <Nav className="me-auto">
            <Nav.Link href="/search">Haku</Nav.Link>
          </Nav>
        )}
        {user ? (
          <div>
            <Navbar.Text className="me-2">
              {user.email}
            </Navbar.Text>
            <Button variant="outline-light" onClick={logout}>Kirjaudu ulos</Button>
          </div>
        ) : (
          <Nav.Link href="/login">Kirjaudu</Nav.Link>
        )}
      </Container>
    </Navbar>
  );
};

export default Header;