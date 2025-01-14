import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Alert, Button } from 'react-bootstrap';

function WillLearnEnglish() {
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
            `http://localhost:1337/api/relations?populate=*&filters[users_id][$eq]=${userId}`
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
  
      const response = await axios.put(
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
  
      console.log('Güncellenen API Yanıtı:', response.data);
  
      // Güncellenen kelimeyi state'den çıkar
      setUnknownWords((prevWords) =>
        prevWords.filter((word) => word.documentId !== documentId)
      );
  
      // Eğer rastgele seçilen kelime güncellendiyse sıfırla
      if (randomWord && randomWord.documentId === documentId) {
        setRandomWord(null);
      }
  
      alert('Kelime başarıyla "learned" olarak işaretlendi.');
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
            <Alert variant="info" className="d-flex justify-content-between align-items-center">
              <strong>{randomWord.word}</strong>
              <Button
                variant="success"
                size="sm"
                onClick={() => markAsLearned(randomWord.documentId)}
              >
                Learned Olarak İşaretle
              </Button>
            </Alert>
          )}
        </>
      )}
    </Container>
  );
}

export default WillLearnEnglish;
