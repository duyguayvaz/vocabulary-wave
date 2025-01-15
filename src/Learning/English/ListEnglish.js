// Bu bileşen, kullanıcının "know" (bildiği) durumundaki İngilizce kelimeleri listeler.
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Alert, ListGroup } from 'react-bootstrap';

function ListEnglish() {
  // knownWords: kullanıcının bildiği kelimeleri tutuyor
  // error: hata mesajları için
  const [knownWords, setKnownWords] = useState([]);
  const [error, setError] = useState(null);

  // Bileşen ilk yüklendiğinde kullanıcı verisini çekip knownWords'u güncelliyoruz.
  useEffect(() => {
    const fetchKnownWords = async () => {
      try {
        const token = localStorage.getItem('jwt');

        // Kullanıcı bilgilerini alıyoruz.
        const userResponse = await axios.get('http://34.78.14.168:1337/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userId = userResponse.data.id;

        // Kullanıcının relations verisini çekiyoruz, lang_id=2 ise İngilizce'ye karşılık geliyor.
        // (Not: Buradaki 2, API tarafında İngilizce için kullanılan ID)
        const relationResponse = await axios.get(
          `http://34.78.14.168:1337/api/relations?populate=word_id.lang_id&filters[users_id][$eq]=${userId}&&filters[word_id][lang_id][id][$eq]=2`
        );

        // "know" durumundaki kelimeleri filtreleyip, kelime metnini alıyoruz.
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

  // Card içinde öğrendiğimiz kelimeleri liste şeklinde gösteriyoruz.
  return (
    <Card className="mt-5 mx-auto" style={{ maxWidth: '600px', backgroundColor: '#f3f3f3'  }}>
      <Card.Body>
        <Card.Title className="text-center">Öğrendiğim Kelimeler</Card.Title>
        {error ? (
          <Alert variant="danger" className="text-center">{error}</Alert>
        ) : (
          <ListGroup>
            {knownWords.map((word, index) => (
              // Kelimeleri listede tek tek gösteriyoruz.
              <ListGroup.Item key={index}>{word}</ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Card.Body>
    </Card>
  );
}

// Bileşeni dışa aktarıyoruz ki diğer sayfalarda kullanabilelim.
export default ListEnglish;
