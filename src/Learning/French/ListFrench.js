// Bu bileşen, kullanıcının "know" durumundaki Fransızca kelimelerini listeler.
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Alert, ListGroup } from 'react-bootstrap';

function ListFrench() {
  // knownWords: kullanıcının bildiği Fransızca kelimeler
  // error: oluşabilecek hata mesajları
  const [knownWords, setKnownWords] = useState([]);
  const [error, setError] = useState(null);

  // Bileşen ilk yüklendiğinde kullanıcının "know" durumundaki kelimelerini çekiyoruz.
  useEffect(() => {
    const fetchKnownWords = async () => {
      try {
        const token = localStorage.getItem('jwt');

        // Kullanıcı bilgilerini alıyoruz
        const userResponse = await axios.get('http://34.78.14.168:1337/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userId = userResponse.data.id;

        // Kullanıcının relations verisini çekiyoruz, lang_id=8 ise Fransızca'ya karşılık geliyor.
        // (Not: Buradaki 8, API tarafında Fransızca için kullanılan ID)
        const relationResponse = await axios.get(
          `http://34.78.14.168:1337/api/relations?populate=word_id.lang_id&filters[users_id][$eq]=${userId}&&filters[word_id][lang_id][id][$eq]=8`
        );

        // "know" olanları filtreliyoruz ve sadece kelime metnini alıyoruz.
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

  // Card içinde liste olarak kelimeleri gösteriyoruz.
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

export default ListFrench;
