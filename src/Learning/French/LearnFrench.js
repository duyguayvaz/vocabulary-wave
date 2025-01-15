// Bu bileşen, Fransızca kelimeleri kullanıcıya rastgele olarak gösterip
// "Biliyorum" ya da "Bilmiyorum" şeklinde işaretlemesini sağlıyor.
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function LearnFrench() {
  // words: Henüz görülmemiş Fransızca kelimeler
  // randomWord: Rastgele seçilen kelime
  // error: hata mesajını tutmak için
  // userId: giriş yapan kullanıcının ID'si
  const [words, setWords] = useState([]);
  const [randomWord, setRandomWord] = useState(null);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  // useNavigate ile sayfalar arası geçiş yapıyoruz
  const navigate = useNavigate();

  // Bileşen yüklendiğinde kullanıcı bilgilerini ve ilişkili kelimeleri çekiyoruz.
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

        // relations tablosundan kullanıcının gördüğü kelimelerin documentId'lerini alıyoruz.
        const relationResponse = await axios.get(
          `http://34.78.14.168:1337/api/relations?populate=*&filters[users_id][$eq]=${userId}`
        );
        const relations = relationResponse.data.data.map(
          (rel) => rel.word_id.documentId
        );
        console.log(relations);

        // Fransızca kelimeleri (lang_id=5) çekiyoruz.
        const wordResponse = await axios.get(
          'http://34.78.14.168:1337/api/words?populate=*&filters[lang_id][lang_id][$eq]=5'
        );

        // relations içinde olmayan kelimeleri filtreliyoruz.
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

  // Rastgele kelime seçme fonksiyonu
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

  // Seçilen kelimeyi "know" ya da "notknow" olarak işaretliyoruz.
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
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          },
        }
      );

      // İşaretlenmiş kelimeyi words listesinden çıkarıyoruz.
      const updatedWords = words.filter((word) => word.id !== randomWord.id);
      setWords(updatedWords);

      // Yeni bir kelime seç, yoksa null
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

  // Arayüzde Card bileşenini kullanarak butonları ve kelimeleri gösteriyoruz.
  return (
    <Card className="mt-5 mx-auto" style={{maxWidth: '600px', backgroundColor: '#f3f3f3' }}>
      <Card.Body>
        <Card.Title className="mb-4 text-center">Fransızca</Card.Title>
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
                  {/* Rastgele seçilen kelimeyi gösteriyoruz */}
                  <strong>{randomWord.word}</strong> - {randomWord.word_tr}
                </Card.Text>
                <Row className="mt-3">
                  <Col className="text-center">
                    {/* "Biliyorum" butonu */}
                    <Button
                      variant="success"
                      onClick={() => updateWordStatus('know')}
                    >
                      Biliyorum
                    </Button>
                  </Col>
                  <Col className="text-center">
                    {/* "Bilmiyorum" butonu */}
                    <Button
                      variant="danger"
                      onClick={() => updateWordStatus('notknow')}
                    >
                      Bilmiyorum
                    </Button>
                  </Col>
                </Row>
                {/* Sayfadan çıkmak için bir buton */}
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

export default LearnFrench;
