import React from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { useAuth } from '../services/auth/authcontext';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">JE Library</Navbar.Brand>
          <Navbar.Text className="me-2">Loading...</Navbar.Text>
        </Container>
      </Navbar>
    );
  }

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
              <Nav.Link href="/reads">
                {user.email}
              </Nav.Link>
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