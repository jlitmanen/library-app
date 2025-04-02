import React from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { useAuth } from '../services/auth/authcontext';

const Header: React.FC = () => {
  const { user, logout, loading } = useAuth();

  return (
    <Navbar bg="dark" variant="dark" expand="md">
      <Container>
        <Navbar.Brand href="/">EJ Lib</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {user && <Nav.Link href="/search">Haku</Nav.Link>}
          </Nav>
          <Nav>
            {loading ? (
              <Navbar.Text className="me-2">Loading...</Navbar.Text>
            ) : user ? (
              <>
                <Nav.Link href="/reads">{user.email}</Nav.Link>
                <Button variant="outline-light" onClick={logout}>Kirjaudu ulos</Button>
              </>
            ) : (
              <Nav.Link href="/login">Kirjaudu</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;