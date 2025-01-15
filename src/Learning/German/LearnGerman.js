// Bu bileşen, Almanca kelimeleri kullanıcının seçimine göre öğrenmesini sağlar.
// useState ve useEffect hook'ları ile verileri çekiyor ve yönetiyoruz.
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function LearnGerman() {
  // words: Kullanıcının henüz görmediği Almanca kelimelerin listesi
  // randomWord: Rastgele seçilecek kelime
  // error: Oluşan hataları tutmak için
  // userId: Giriş yapan kullanıcının ID'si
  const [words, setWords] = useState([]);
  const [randomWord, setRandomWord] = useState(null);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  // useNavigate: sayfalar arası geçiş yapmamızı sağlar
  const navigate = useNavigate();

  // Bileşen yüklendiğinde kullanıcı bilgilerini ve kelimeleri yüklüyoruz.
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Token'ı localStorage'den alıyoruz.
        const token = localStorage.getItem('jwt');

        // Kullanıcı bilgilerini çekiyoruz.
        const userResponse = await axios.get('http://34.78.14.168:1337/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // userId'yi state'e kaydediyoruz.
        const userId = userResponse.data.id;
        setUserId(userId);

        // relations tablosunu çekerek, kullanıcının daha önce gördüğü kelimeleri buluyoruz.
        const relationResponse = await axios.get(
          `http://34.78.14.168:1337/api/relations?populate=*&filters[users_id][$eq]=${userId}`
        );
        const relations = relationResponse.data.data.map(
          (rel) => rel.word_id.documentId
        );

        // Almanca kelimeler için lang_id=3 bilgisine göre istek atıyoruz.
        const wordResponse = await axios.get(
          'http://34.78.14.168:1337/api/words?populate=*&filters[lang_id][lang_id][$eq]=3'
        );

        // Daha önce görülmeyen kelimeleri filtreliyoruz.
        const filteredWords = wordResponse.data.data.filter(
          (words) => !relations.includes(words.documentId)
        );
        setWords(filteredWords);
      } catch (err) {
        setError('Veriler yüklenirken bir hata oluştu.');
      }
    };

    fetchData();
  }, []);

  // Rastgele kelime seçmek için fonksiyon.
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

  // Kullanıcı "Biliyorum" ya da "Bilmiyorum" dediğinde kelime durumunu relations'a ekliyoruz.
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

      // Kelimeyi words listesinden çıkarıp yeni rastgele kelime seçiyoruz.
      const updatedWords = words.filter((word) => word.id !== randomWord.id);
      setWords(updatedWords);

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

  // Card içinde Almanca kelimeleri görüntüleyip kullanıcı etkileşimini sağlıyoruz.
  return (
    <Card className="mt-5 mx-auto" style={{maxWidth: '600px', backgroundColor: '#f3f3f3' }}>
      <Card.Body>
        <Card.Title className="mb-4 text-center">Almanca</Card.Title>
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

// Diğer dosyalarda kullanabilmek için dışa aktarıyoruz.
export default LearnGerman;
