// src/pages/dashboard/MyVocab.js
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Card, Row, Col } from 'react-bootstrap'

function MyVocab() {
  const [vocabList, setVocabList] = useState([])

  useEffect(() => {
    axios
      .get('http://localhost:1337/api/vocabs')
      .then((res) => {
        // Strapi v4 => res.data.data
        setVocabList(res.data.data)
      })
      .catch((err) => console.error(err))
  }, [])

  return (
    <Card>
      <Card.Body>
        <Card.Title>Kelime Haznem</Card.Title>
        {vocabList.length === 0 ? (
          <p>Henüz kelime eklenmemiş.</p>
        ) : (
          <Row>
            {vocabList.map((item) => (
              <Col md={4} className="mb-3" key={item.id}>
                <Card className="h-100">
                  <Card.Body>
                    <Card.Subtitle className="mb-2 text-muted">
                      {item.attributes.language}
                    </Card.Subtitle>
                    <Card.Text>
                      {item.attributes.wordCount} kelime
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Card.Body>
    </Card>
  )
}

export default MyVocab
