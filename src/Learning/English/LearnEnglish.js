// Bu bileşen, İngilizce kelimeleri kullanıcının seçimine göre öğrenmesini sağlar.
// useState ve useEffect hook'ları ile verileri çekiyor ve yönetiyoruz.
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function LearnEnglish() {
  // words: Kullanıcının henüz görmediği tüm kelimeler
  // randomWord: Rastgele seçilecek kelime
  // error: Oluşan hataları tutmak için
  // userId: Giriş yapan kullanıcının ID'si
  const [words, setWords] = useState([]);
  const [randomWord, setRandomWord] = useState(null);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  // useNavigate: Sayfalar arası geçiş yapmamızı sağlayan hook
  const navigate = useNavigate();

  // Bileşen yüklendiğinde kullanıcı bilgisini ve kelimeleri çekiyoruz.
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Tarayıcıda saklanan JWT token'ı alıyoruz.
        const token = localStorage.getItem('jwt');

        // Giriş yapan kullanıcının bilgilerini çekiyoruz.
        const userResponse = await axios.get('http://34.78.14.168:1337/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Kullanıcının ID'sini state'e atıyoruz.
        const userId = userResponse.data.id;
        setUserId(userId);

        // relations tablosundaki verileri alıp, kullanıcının daha önce gördüğü kelimeleri buluyoruz.
        const relationResponse = await axios.get(
          `http://34.78.14.168:1337/api/relations?populate=*&filters[users_id][$eq]=${userId}`
        );
        // Daha önce ilişkilendirilmiş kelimelerin documentId'lerini relations dizisine ekliyoruz.
        const relations = relationResponse.data.data.map(
          (rel) => rel.word_id.documentId
        );

        // İngilizce kelimeleri (lang_id=1) çekiyoruz.
        const wordResponse = await axios.get(
          'http://34.78.14.168:1337/api/words?populate=*&filters[lang_id][lang_id][$eq]=1'
        );

        // Daha önce görülmeyen kelimeleri filtreliyoruz.
        const filteredWords = wordResponse.data.data.filter(
          (words) => !relations.includes(words.documentId)
        );
        setWords(filteredWords);
      } catch (err) {
        // Bir hata oluşursa hata mesajını güncelliyoruz.
        setError('Veriler yüklenirken bir hata oluştu.');
      }
    };

    fetchData();
  }, []);

  // Rastgele bir kelime seçmeye yarayan fonksiyon.
  const getRandomWord = () => {
    if (words.length > 0) {
      const randomIndex = Math.floor(Math.random() * words.length);
      setRandomWord(words[randomIndex]);
      setError(null); // Eğer kelime varsa hata mesajını temizliyoruz.
    } else {
      setRandomWord(null);
      // Kelime kalmazsa kullanıcıya uyarı mesajı veriyoruz.
      setError('Tüm Kelimeleri Gördün.');
    }
  };

  // Kullanıcı "Biliyorum" ya da "Bilmiyorum" dediğinde kelime durumunu güncelleme fonksiyonu.
  const updateWordStatus = async (status) => {
    if (!randomWord || !userId) return;

    try {
      // Seçilen kelimenin durumunu relations tablosuna ekliyoruz.
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

      // Seçilen kelimeyi words listesinden çıkartıyoruz.
      const updatedWords = words.filter((word) => word.id !== randomWord.id);
      setWords(updatedWords);

      // Eğer hala kelime varsa rastgele bir tane daha seçiyoruz.
      if (updatedWords.length > 0) {
        const randomIndex = Math.floor(Math.random() * updatedWords.length);
        setRandomWord(updatedWords[randomIndex]);
      } else {
        // Kelime kalmadıysa randomWord'ü null yapıyoruz.
        setRandomWord(null);
      }
    } catch (err) {
      // Bir hata oluşursa kullanıcıya uyarı gösteriyoruz.
      alert('Kelime durumu güncellenirken bir hata oluştu.');
    }
  };

  // Arayüzde Card bileşenini kullanarak kelimeleri gösteriyoruz.
  return (
    <Card className="mt-5 mx-auto" style={{maxWidth: '600px', backgroundColor: '#f3f3f3' }}>
      <Card.Body>
        <Card.Title className="mb-4 text-center">İngilizce</Card.Title>
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
                  {/* Rastgele seçilen kelimeyi ve Türkçe karşılığını gösteriyoruz. */}
                  <strong>{randomWord.word}</strong> - {randomWord.word_tr}
                </Card.Text>
                <Row className="mt-3">
                  <Col className="text-center">
                    {/* Biliyorum butonu */}
                    <Button
                      variant="success"
                      onClick={() => updateWordStatus('know')}
                    >
                      Biliyorum
                    </Button>
                  </Col>
                  <Col className="text-center">
                    {/* Bilmiyorum butonu */}
                    <Button
                      variant="danger"
                      onClick={() => updateWordStatus('notknow')}
                    >
                      Bilmiyorum
                    </Button>
                  </Col>
                </Row>
                {/* Öğrenmeyi bırakmak için buton */}
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

// Bileşeni dışa aktarıyoruz ki diğer dosyalarda kullanılabilsin.
export default LearnEnglish;
