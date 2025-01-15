// Bu bileşen, kullanıcının "notknow" (bilmediği) durumundaki İngilizce kelimeleri
// tekrar gözden geçirip "learned" olarak işaretlemesini sağlar.
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Row, Col } from 'react-bootstrap';

function WillLearnEnglish() {
  // unknownWords: kullanıcının bilmediği kelimeler
  // randomWord: Rastgele seçilen kelime
  // error: hata mesajlarını tutmak için
  const [unknownWords, setUnknownWords] = useState([]);
  const [randomWord, setRandomWord] = useState(null);
  const [error, setError] = useState(null);

  // Bileşen yüklendiğinde "notknow" durumundaki kelimeleri çekiyoruz.
  useEffect(() => {
    const fetchUnknownWords = async () => {
      try {
        const token = localStorage.getItem('jwt');

        // Kullanıcının ID'sini alıyoruz.
        const userResponse = await axios.get('http://34.78.14.168:1337/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userId = userResponse.data.id;

        // "notknow" durumda olan kelimeleri relation tablosundan çekiyoruz.
        // lang_id=2 İngilizceye karşılık geliyor.
        const relationResponse = await axios.get(
          `http://34.78.14.168:1337/api/relations?populate=word_id.lang_id&filters[users_id][$eq]=${userId}&&filters[word_id][lang_id][id][$eq]=2`
        );

        // notknow olan kelimeleri yeni bir diziye kaydediyoruz.
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

  // Rastgele bir kelime gösteren fonksiyon.
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

  // Kullanıcı "Öğrendim" dediğinde kelimeyi "learned" olarak işaretleyen fonksiyon.
  const markAsLearned = async (documentId) => {
    try {
      const token = localStorage.getItem('jwt');

      // Kelimenin durumunu "learned" yapıyoruz.
      await axios.put(
        `http://34.78.14.168:1337/api/relations/${documentId}`,
        {
          data: {
            word_status: 'learned',
          },
        }
      );

      // Kelimeyi unknownWords listesinden çıkarıyoruz.
      const updatedWords = unknownWords.filter((word) => word.documentId !== documentId);
      setUnknownWords(updatedWords);

      // Eğer seçili kelime (randomWord) güncellenen kelimeyse, yeni bir kelime seçiyoruz.
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

  // Arayüzde card içinde Rastgele kelime gösterip öğrenme imkanı sunuyoruz.
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
            {/* Butona basarak rastgele kelime seçmeye başlıyoruz */}
            <Button 
              onClick={showRandomWord} 
              className="mb-4 d-block mx-auto" 
              style={{backgroundColor: '#647daf',border: 'none'}}
            >
              Öğrenmeye Başla
            </Button>

            {/* Rastgele kelime varsa gösteriyoruz. */}
            {randomWord && (
              <>
                <Card.Text className="text-center">
                  <strong>{randomWord.word}</strong> - {randomWord.word_tr}
                </Card.Text>
                <Row className="mt-3">
                  <Col className="text-center">
                    {/* Kelimeyi learned olarak işaretleyen buton */}
                    <Button
                      variant="success"
                      onClick={() => markAsLearned(randomWord.documentId)}
                    >
                      Öğrendim
                    </Button>
                  </Col>
                  <Col className="text-center">
                    {/* Yeniden rastgele kelime seçmek için buton */}
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
export default WillLearnEnglish;
