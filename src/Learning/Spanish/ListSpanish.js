// Bu bileşen, kullanıcının "know" durumundaki İspanyolca kelimeleri listeler.
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Alert, ListGroup } from 'react-bootstrap';

function ListSpanish() {
  // knownWords: kullanıcının bildiği İspanyolca kelimeler
  // error: hata durumlarını tutar
  const [knownWords, setKnownWords] = useState([]);
  const [error, setError] = useState(null);

  // Bileşen yüklendiğinde "know" durumundaki kelimeleri çekiyoruz.
  useEffect(() => {
    const fetchKnownWords = async () => {
      try {
        const token = localStorage.getItem('jwt');

        // Kullanıcının ID'sini alıyoruz.
        const userResponse = await axios.get('http://34.78.14.168:1337/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userId = userResponse.data.id;

        // relationResponse: lang_id=13 (API'de İspanyolca) olan verileri alıyoruz.
        const relationResponse = await axios.get(
          `http://34.78.14.168:1337/api/relations?populate=word_id.lang_id&filters[users_id][$eq]=${userId}&&filters[word_id][lang_id][id][$eq]=13`
        );

        // "know" durumunda olan kelimeleri filtreleyip, kelime metnini alıyoruz.
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

  // Card içerisine liste şeklinde gösteriyoruz.
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

// Bileşeni dışa aktarıyoruz.
export default ListSpanish;
