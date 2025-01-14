import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Alert, ListGroup } from 'react-bootstrap';

function ListGerman() {
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
          `http://localhost:1337/api/relations?populate=word_id.lang_id&filters[users_id][$eq]=${userId}&&filters[word_id][lang_id][id][$eq]=7`, // Lang ID: 3 for German
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
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
    <Container className="mt-5">
      <h2>Öğrendiğim Almanca Kelimeler</h2>
      {error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <ListGroup>
          {knownWords.map((word, index) => (
            <ListGroup.Item key={index}>{word}</ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Container>
  );
}

export default ListGerman;
