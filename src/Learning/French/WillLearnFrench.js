// Bu bileşen, "notknow" durumundaki Fransızca kelimeleri tekrar gösterip
// kullanıcıya "learned" olarak işaretleme imkanı verir.
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Row, Col } from 'react-bootstrap';

function WillLearnFrench() {
  // unknownWords: kullanıcı tarafından henüz öğrenilmemiş kelimeler
  // randomWord: Rastgele seçilen kelime
  // error: oluşabilecek hatalar için
  const [unknownWords, setUnknownWords] = useState([]);
  const [randomWord, setRandomWord] = useState(null);
  const [error, setError] = useState(null);

  // Bileşen yüklendiğinde "notknow" durumundaki kelimeleri API'den çekiyoruz.
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

        // Bu kez lang_id=8 (Fransızca) ve word_status=notknow olan kelimeleri çekiyoruz.
        const relationResponse = await axios.get(
          `http://34.78.14.168:1337/api/relations?populate=word_id.lang_id&filters[users_id][$eq]=${userId}&&filters[word_id][lang_id][id][$eq]=8`
        );

        // notknow durumundaki kelimeleri listeye çeviriyoruz.
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

  // Rastgele kelime gösteren fonksiyon
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

  // Kullanıcı kelimeyi "learned" olarak işaretlediğinde çağırılan fonksiyon
  const markAsLearned = async (documentId) => {
    try {
      const token = localStorage.getItem('jwt');

      // Kelime durumunu güncelliyoruz.
      await axios.put(
        `http://34.78.14.168:1337/api/relations/${documentId}`,
        {
          data: {
            word_status: 'learned',
          },
        }
      );

      // unknownWords listesinden güncellenen kelimeyi çıkarıyoruz.
      const updatedWords = unknownWords.filter((word) => word.documentId !== documentId);
      setUnknownWords(updatedWords);

      // Eğer rastgele seçilen kelime de aynı kelimeyse yeni bir kelime seçiyoruz.
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

  // Arayüzde, kullanıcının rastgele kelimelerle çalışmasına imkan tanıyoruz.
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
              style={{backgroundColor: '#647daf',border: 'none'}}
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
                    {/* "Öğrendim" butonu */}
                    <Button
                      variant="success"
                      onClick={() =>markAsLearned(randomWord.documentId)}
                    >
                      Öğrendim
                    </Button>
                  </Col>
                  <Col className="text-center">
                    {/* Yeni bir rastgele kelime almak için buton */}
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

export default WillLearnFrench;
