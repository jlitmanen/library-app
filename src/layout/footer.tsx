import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const Footer: React.FC = () => {
  return (
    <Container>
        <Row>
            <Col className="text-center text-light">
            <p>&copy; {new Date().getFullYear()} <a href="https://github.com/jlitmanen/library-app" target='_blank'>JE Library.</a></p>
            </Col>
        </Row>
    </Container>
  );
};

export default Footer;