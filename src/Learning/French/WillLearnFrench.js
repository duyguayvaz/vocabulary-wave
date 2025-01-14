import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Alert, Button, Row, Col } from 'react-bootstrap';

function WillLearnFrench() {
  const [unknownWords, setUnknownWords] = useState([]); // "notknow" kelimeler
  const [randomWord, setRandomWord] = useState(null); // Rastgele seçilen kelime
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUnknownWords = async () => {
        try {
          const token = localStorage.getItem('jwt');
      
          const userResponse = await axios.get('http://localhost:1337/api/users/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
      
          const userId = userResponse.data.id;
      
          const relationResponse = await axios.get(
            `http://localhost:1337/api/relations?populate=word_id.lang_id&filters[users_id][$eq]=${userId}&&filters[word_id][lang_id][id][$eq]=2`
          );
      
          const unknownWords = relationResponse.data.data
            .filter((rel) => rel.word_status === 'notknow')
            .map((rel) => ({
              documentId: rel.documentId, // API'den dönen `documentId`
              word: rel.word_id.word, // Kelimenin İngilizce hali
              word_tr: rel.word_id.word_tr, // Kelimenin Türkçe çevirisi
            }));
      
          setUnknownWords(unknownWords);
        } catch (err) {
          setError('Bilinmeyen kelimeler yüklenirken bir hata oluştu.');
          console.error(err);
        }
      };
      

    fetchUnknownWords();
  }, []);

  const showRandomWord = () => {
    if (unknownWords.length > 0) {
      const randomIndex = Math.floor(Math.random() * unknownWords.length);
      setRandomWord(unknownWords[randomIndex]);
    } else {
      setRandomWord(null);
    }
  };

  const markAsLearned = async (documentId) => {
    try {
      const token = localStorage.getItem('jwt');
  
      // API'ye istek gönder
      await axios.put(
        `http://localhost:1337/api/relations/${documentId}`,
        {
          data: {
            word_status: 'learned',
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      // Güncellenen kelimeyi state'den çıkar
      const updatedWords = unknownWords.filter((word) => word.documentId !== documentId);
      setUnknownWords(updatedWords);
  
      // Eğer rastgele seçilen kelime güncellendiyse, yeni bir kelime seç
      if (randomWord && randomWord.documentId === documentId) {
        if (updatedWords.length > 0) {
          const randomIndex = Math.floor(Math.random() * updatedWords.length);
          setRandomWord(updatedWords[randomIndex]);
        } else {
          setRandomWord(null); // Kelime kalmadıysa sıfırla
        }
      }
    } catch (err) {
      console.error('Güncelleme Hatası:', err.response?.data || err.message);
      alert('Kelime durumu güncellenirken bir hata oluştu.');
    }
  };
  
  return (
    <Container className="mt-5">
      <h2>Bilinmeyen Kelimeler</h2>
      {error ? (
        <Alert variant="danger">{error}</Alert>
      ) : (
        <>
          <Button variant="primary" onClick={showRandomWord} className="mb-3">
            Rastgele Kelime Göster
          </Button>
          {randomWord && (
            <Alert variant="success">
              <strong>{randomWord.word}</strong> - {randomWord.word_tr}
              <Row className="mt-3">
                <Col>
              <Button
                variant="success"
                onClick={() => markAsLearned(randomWord.documentId)}
              >
                Öğrendim
              </Button>
              </Col>
              <Col>
              <Button
                variant="success"
                onClick={showRandomWord}
              >
                Tekrar Et
              </Button>
              </Col>
              </Row>
            </Alert>
          )}
        </>
      )}
    </Container>
  );
}

export default WillLearnFrench;
