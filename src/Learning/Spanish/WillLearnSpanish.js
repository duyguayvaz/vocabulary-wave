// Bu bileşen, "notknow" durumundaki İspanyolca kelimeleri tekrar gösterip
// kullanıcının "learned" olarak işaretlemesine imkan tanır.
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Row, Col } from 'react-bootstrap';

function WillLearnSpanish() {
  // unknownWords: notknow durumda olan kelimeler
  // randomWord: Rastgele seçilen kelime
  // error: hata mesajlarını göstermek için
  const [unknownWords, setUnknownWords] = useState([]);
  const [randomWord, setRandomWord] = useState(null);
  const [error, setError] = useState(null);

  // Bileşen yüklendiğinde "notknow" kelimeleri çekiyoruz.
  useEffect(() => {
    const fetchUnknownWords = async () => {
      try {
        const token = localStorage.getItem('jwt');

        const userResponse = await axios.get('http://34.78.14.168:1337/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userId = userResponse.data.id;

        // İspanyolca (lang_id=13) ve "notknow" durumundaki kelimeleri relations tablosundan alıyoruz.
        const relationResponse = await axios.get(
          `http://34.78.14.168:1337/api/relations?populate=word_id.lang_id&filters[users_id][$eq]=${userId}&&filters[word_id][lang_id][id][$eq]=13`
        );

        // notknow olanları listeye kaydediyoruz.
        const unknownWords = relationResponse.data.data
          .filter((rel) => rel.word_status === 'notknow')
          .map((rel) => ({
            documentId: rel.documentId,
            word: rel.word_id.word,
            word_tr: rel.word_id.word_tr,
          }));

        setUnknownWords(unknownWords);
      } catch (err) {
        setError('Bilinmeyen kelimeler yüklenirken bir hata oluştu.');
        console.error(err);
      }
    };

    fetchUnknownWords();
  }, []);

  // Rastgele kelime seçen fonksiyon
  const showRandomWord = () => {
    if (unknownWords.length > 0) {
      const randomIndex = Math.floor(Math.random() * unknownWords.length);
      setRandomWord(unknownWords[randomIndex]);
      setError(null);
    } else {
      setRandomWord(null);
      setError('Tüm Kelimeleri Öğrendin.');
    }
  };

  // Kullanıcı "Öğrendim" dediğinde kelimeyi "learned" olarak işaretleme fonksiyonu
  const markAsLearned = async (documentId) => {
    try {
      const token = localStorage.getItem('jwt');

      // Kelime durumunu "learned" yapıyoruz
      await axios.put(
        `http://34.78.14.168:1337/api/relations/${documentId}`,
        {
          data: {
            word_status: 'learned',
          },
        }
      );

      // Güncellenen kelimeyi unknownWords listesinden çıkarıyoruz
      const updatedWords = unknownWords.filter((word) => word.documentId !== documentId);
      setUnknownWords(updatedWords);

      // Eğer seçili kelime de aynı kelimeyse yeni bir kelime seçiyoruz
      if (randomWord && randomWord.documentId === documentId) {
        if (updatedWords.length > 0) {
          const randomIndex = Math.floor(Math.random() * updatedWords.length);
          setRandomWord(updatedWords[randomIndex]);
        } else {
          setRandomWord(null);
        }
      }
    } catch (err) {
      console.error('Güncelleme Hatası:', err.response?.data || err.message);
      alert('Kelime durumu güncellenirken bir hata oluştu.');
    }
  };

  // Card içinde rastgele kelime gösterip "Öğrendim" şeklinde işaretlemesini sağlıyoruz.
  return (
    <Card className="mt-5 mx-auto" style={{maxWidth: '600px', backgroundColor: '#f3f3f3' }}>
      <Card.Body>
        <Card.Title className="mb-4 text-center">Öğreneceğim Kelimeler</Card.Title>
        {error ? (
          <div className="alert alert-success text-center">
            {error}
          </div>
        ) : (
          <>
            <Button
              onClick={showRandomWord}
              className="mb-4 d-block mx-auto"
              style={{backgroundColor: '#647daf', border: 'none'}}
            >
              Öğrenmeye Başla
            </Button>
            {randomWord && (
              <>
                <Card.Text className="text-center">
                  <strong>{randomWord.word}</strong> - {randomWord.word_tr}
                </Card.Text>
                <Row className="mt-3">
                  <Col className="text-center">
                    <Button
                      variant="success"
                      onClick={() => markAsLearned(randomWord.documentId)}
                    >
                      Öğrendim
                    </Button>
                  </Col>
                  <Col className="text-center">
                    <Button
                      variant="danger"
                      onClick={showRandomWord}
                    >
                      Tekrar Et
                    </Button>
                  </Col>
                </Row>
              </>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
}

// Bileşeni dışa aktarıyoruz.
export default WillLearnSpanish;
