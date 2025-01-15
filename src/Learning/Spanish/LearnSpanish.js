// Bu bileşen, İspanyolca kelimeleri kullanıcıya rastgele olarak gösterip
// "Biliyorum" ya da "Bilmiyorum" şeklinde işaretlemesini sağlar.
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function LearnSpanish() {
  // words: Henüz görülmemiş İspanyolca kelimeler
  // randomWord: Rastgele seçilen kelime
  // error: hata mesajını tutmak için
  // userId: giriş yapan kullanıcının ID'si
  const [words, setWords] = useState([]);
  const [randomWord, setRandomWord] = useState(null);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  // useNavigate: sayfa geçişlerini yapmamızı sağlar
  const navigate = useNavigate();

  // Bileşen yüklendiğinde kullanıcı bilgilerini ve ilişkili verileri çekiyoruz.
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('jwt');

        // Kullanıcı bilgisini çekiyoruz
        const userResponse = await axios.get('http://34.78.14.168:1337/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const userId = userResponse.data.id;
        setUserId(userId);

        // relations tablosundan kullanıcıya ait kelime bilgilerini alıyoruz.
        const relationResponse = await axios.get(
          `http://34.78.14.168:1337/api/relations?populate=*&filters[users_id][$eq]=${userId}`
        );

        // Kullanıcının gördüğü kelimelerin documentId'lerini relations dizisine ekliyoruz.
        const relations = relationResponse.data.data.map(
          (rel) => rel.word_id.documentId
        );
        console.log(relations);

        // İspanyolca kelimeleri (lang_id=11) çekiyoruz.
        const wordResponse = await axios.get(
          'http://34.78.14.168:1337/api/words?populate=*&filters[lang_id][lang_id][$eq]=11'
        );

        // relations içinde olmayan kelimeleri words listesinden filtreliyoruz.
        const filteredWords = wordResponse.data.data.filter(
          (words) => !relations.includes(words.documentId)
        );
        setWords(filteredWords);
        console.log(filteredWords);

      } catch (err) {
        setError('Veriler yüklenirken bir hata oluştu.');
      }
    };

    fetchData();
  }, []);

  // Rastgele bir kelime seçen fonksiyon
  const getRandomWord = () => {
    if (words.length > 0) {
      const randomIndex = Math.floor(Math.random() * words.length);
      setRandomWord(words[randomIndex]);
      setError(null);
    } else {
      setRandomWord(null);
      setError('Tüm Kelimeleri Gördün.');
    }
  };

  // Kelimenin durumunu "know" ya da "notknow" olarak ayarlıyoruz.
  const updateWordStatus = async (status) => {
    if (!randomWord || !userId) return;

    try {
      await axios.post(
        'http://34.78.14.168:1337/api/relations',
        {
          data: {
            users_id: userId,
            word_id: randomWord.documentId,
            word_status: status,
          },
        }
      );

      // Seçilen kelimeyi words listesinden çıkarıyoruz.
      const updatedWords = words.filter((word) => word.id !== randomWord.id);
      setWords(updatedWords);

      // Eğer kelime kaldıysa rastgele bir kelime daha seç, yoksa null
      if (updatedWords.length > 0) {
        const randomIndex = Math.floor(Math.random() * updatedWords.length);
        setRandomWord(updatedWords[randomIndex]);
      } else {
        setRandomWord(null);
      }
    } catch (err) {
      alert('Kelime durumu güncellenirken bir hata oluştu.');
    }
  };

  // Card yapısıyla arayüz oluşturuyoruz.
  return (
    <Card className="mt-5 mx-auto" style={{maxWidth: '600px', backgroundColor: '#f3f3f3' }}>
      <Card.Body>
        <Card.Title className="mb-4 text-center">İspanyolca</Card.Title>
        {error ? (
          <div className="alert alert-success text-center">
            {error}
          </div>
        ) : (
          <>
            <Button
              onClick={getRandomWord}
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
                      onClick={() => updateWordStatus('know')}
                    >
                      Biliyorum
                    </Button>
                  </Col>
                  <Col className="text-center">
                    <Button
                      variant="danger"
                      onClick={() => updateWordStatus('notknow')}
                    >
                      Bilmiyorum
                    </Button>
                  </Col>
                </Row>
                {/* Kullanıcının sayfadan çıkması için "Bu Kadar Yeter" butonu */}
                <Button
                  className="mt-4 d-block mx-auto"
                  variant="dark"
                  onClick={() => navigate('/language/english')}
                >
                  Bu Kadar Yeter
                </Button>
              </>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
}

// Bileşeni dışa aktarıyoruz.
export default LearnSpanish;
