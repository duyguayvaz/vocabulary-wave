import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Alert, ListGroup } from 'react-bootstrap';

function ListSpanish() {
  const [knownWords, setKnownWords] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKnownWords = async () => {
      try {
        const token = localStorage.getItem('jwt');

        // Kullanıcı bilgilerini çek
        const userResponse = await axios.get('http://localhost:1337/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userId = userResponse.data.id;

        // Kullanıcının relations verisini çek
        const relationResponse = await axios.get(
          `http://localhost:1337/api/relations?populate=word_id.lang_id&filters[users_id][$eq]=${userId}&&filters[word_id][lang_id][id][$eq]=13`
        );

        // "know" olan kelimeleri filtrele
        const knownWords = relationResponse.data.data
          .filter((rel) => rel.word_status === 'know')
          .map((rel) => rel.word_id.word);

        setKnownWords(knownWords);
      } catch (err) {
        setError('Öğrendiğiniz kelimeler yüklenirken bir hata oluştu.');
      }
    };

    fetchKnownWords();
  }, []);

  return (
    <Card className="mt-5 mx-auto" style={{ maxWidth: '600px', backgroundColor: '#f3f3f3' }}>
    <Card.Body>
      <Card.Title className="text-center">Öğrendiğim Kelimeler</Card.Title>
      {error ? (
        <Alert variant="danger" className="text-center">{error}</Alert>
      ) : (
        <ListGroup>
          {knownWords.map((word, index) => (
            <ListGroup.Item key={index}>{word}</ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Card.Body>
  </Card>
  );
}

export default ListSpanish;
