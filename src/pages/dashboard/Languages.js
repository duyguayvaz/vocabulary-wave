// src/pages/dashboard/Languages.js
import React from 'react'
import { Card, ListGroup } from 'react-bootstrap'

function Languages() {
  return (
    <Card>
      <Card.Body>
        <Card.Title>Diller</Card.Title>
        <Card.Text>
          İstediğiniz dili seçip çalışmaya başlayabilirsiniz.
        </Card.Text>

        <ListGroup>
          <ListGroup.Item>İngilizce</ListGroup.Item>
          <ListGroup.Item>Almanca</ListGroup.Item>
          <ListGroup.Item>İspanyolca</ListGroup.Item>
          <ListGroup.Item>Fransızca</ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  )
}

export default Languages
