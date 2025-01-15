// Bu bileşen, kullanıcının "know" durumundaki Almanca kelimeleri listeler.
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Alert, ListGroup } from 'react-bootstrap';

function ListGerman() {
  // knownWords: kullanıcının bildiği Almanca kelimeleri tutmak için
  // error: oluşan hataları tutmak için
  const [knownWords, setKnownWords] = useState([]);
  const [error, setError] = useState(null);

  // Bileşen yüklendiğinde "know" durumundaki Almanca kelimeleri çekiyoruz.
  useEffect(() => {
    const fetchKnownWords = async () => {
      try {
        const token = localStorage.getItem('jwt');

        // Kullanıcının bilgilerini alıyoruz.
        const userResponse = await axios.get('http://34.78.14.168:1337/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userId = userResponse.data.id;

        // Kullanıcının relations verisini çekiyoruz, lang_id=7 ise Almanca'ya karşılık geliyor.
        // (Not: Buradaki 7, API tarafında Almanca için kullanılan ID)
        const relationResponse = await axios.get(
          `http://34.78.14.168:1337/api/relations?populate=word_id.lang_id&filters[users_id][$eq]=${userId}&&filters[word_id][lang_id][id][$eq]=7`
        );

        // "know" durumundaki kelimeleri filtreliyoruz ve sadece kelime değerini alıyoruz.
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

  // Card ile arayüzde gösteriyoruz.
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
export default ListGerman;
