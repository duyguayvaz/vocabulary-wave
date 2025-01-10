// src/pages/Home.js
import React from 'react'
import { Card, Button, Container, Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Vocabulary Wave</Card.Title>
              <Card.Text>
                Yeni bir dil öğrenmeye hazır mısın? Hemen kayıt olabilir veya giriş yaparak başlayabilirsiniz.
              </Card.Text>
              <Link to="/kayit-ol">
                <Button variant="primary" className="me-2">Kayıt Ol</Button>
              </Link>
              <Link to="/giris-yap">
                <Button variant="secondary">Giriş Yap</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default Home
