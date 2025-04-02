import React from 'react';
import { Navbar, Nav, Button, Container } from 'react-bootstrap';
import { useAuth } from '../services/auth/authcontext';

import { FaSearch } from "react-icons/fa";
import { FaRegUser } from "react-icons/fa";
import { FaHome } from "react-icons/fa";

const Header: React.FC = () => {
  const { user, logout, loading } = useAuth();

  return (
    <Navbar bg="dark" variant="dark" expand="md">
      <Container>
        <Navbar.Brand href="/">
          <img
            src={"/android-chrome-192x192.png"}
            style={{ maxWidth: '30px', marginRight: '5px'}}
          />
          Lib
          </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          {user && 
            <Nav className="me-auto">
              <Nav.Link href="/"><FaHome /> Oma</Nav.Link>
              <Nav.Link href="/search"><FaSearch /> Haku</Nav.Link>
            </Nav>
          }

          <Nav>
            {loading ? (
              <Navbar.Text className="me-2">Loading...</Navbar.Text>
            ) : user ? (
              <>
                <Nav.Link href="/reads"><FaRegUser /> {user.email}</Nav.Link>
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