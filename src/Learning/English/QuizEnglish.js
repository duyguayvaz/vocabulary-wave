// Bu bileşen, kullanıcının daha önce "learned" olarak işaretlediği kelimeleri
// quiz şeklinde tekrar etmesini sağlıyor.
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Alert, Button, Form } from 'react-bootstrap';

function QuizEnglish() {
  // learnedWords: quiz yapılacak kelimeler
  // currentWord: şu an sorulan kelime
  // userAnswer: kullanıcının girdiği cevap
  // feedback: Doğru ya da yanlış olduğuna dair uyarı
  // error: herhangi bir hata mesajı
  const [learnedWords, setLearnedWords] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);

  // Bileşen yüklendiğinde kullanıcıya ait learned durumundaki kelimeleri çekiyoruz.
  useEffect(() => {
    fetchLearnedWords();
  }, []);

  // "learned" durumundaki kelimeleri API'den alıp state'e atıyoruz.
  const fetchLearnedWords = async () => {
    try {
      const token = localStorage.getItem('jwt');

      const userResponse = await axios.get('http://34.78.14.168:1337/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userId = userResponse.data.id;

      // Burada lang_id=2'nin İngilizceye karşılık geldiğini varsayıyoruz.
      const relationResponse = await axios.get(
        `http://34.78.14.168:1337/api/relations?populate=word_id.lang_id&filters[users_id][$eq]=${userId}&&filters[word_id][lang_id][id][$eq]=2&filters[word_status][$eq]=learned`
      );

      // API'den gelen verilerden quiz yapacağımız kelimeleri dizi haline getiriyoruz.
      const words = relationResponse.data.data.map((rel) => ({
        documentId: rel.documentId,
        word: rel.word_id.word,
        word_tr: rel.word_id.word_tr,
      }));

      setLearnedWords(words);
    } catch (err) {
      setError('Learned kelimeler yüklenirken bir hata oluştu.');
      console.error(err);
    }
  };

  // Kullanıcı "Quiz'e Başla" butonuna tıkladığında veya bir cevaptan sonra yeni kelime seçmek istediğinde
  // rastgele bir kelime seçiyoruz.
  const handleNextWord = () => {
    if (learnedWords.length > 0) {
      const randomIndex = Math.floor(Math.random() * learnedWords.length);
      const selectedWord = learnedWords[randomIndex];
      setCurrentWord(selectedWord);

      // Bu seçilen kelimeyi listeden çıkararak tekrar seçilmesini engelliyoruz.
      setLearnedWords((prevWords) => prevWords.filter((word) => word.documentId !== selectedWord.documentId));
      
      // Her yeni kelimede önceki feedback ve kullanıcı cevabını temizliyoruz.
      setFeedback(null);
      setUserAnswer('');
    } else {
      // Kelime kalmadıysa quiz tamamlandı mesajı veriyoruz.
      setCurrentWord(null);
      setFeedback('Quiz tamamlandı!');
    }
  };

  // Kullanıcı cevabı gönderdiğinde çalışacak fonksiyon.
  const handleAnswerSubmit = async (e) => {
    e.preventDefault();

    if (!currentWord) return;

    // Cevap doğru mu kontrol ediyoruz.
    const isCorrect = userAnswer.trim().toLowerCase() === currentWord.word_tr.toLowerCase();
    // Doğruysa "know", yanlışsa "notknow" olarak güncelliyoruz.
    const newStatus = isCorrect ? 'know' : 'notknow';

    try {
      const token = localStorage.getItem('jwt');

      // Kelimenin status'unu API'den güncelliyoruz.
      await axios.put(
        `http://34.78.14.168:1337/api/relations/${currentWord.documentId}`,
        {
          data: {
            word_status: newStatus,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Kullanıcıya geri bildirim mesajı gösteriyoruz.
      setFeedback(isCorrect ? 'Doğru cevap!' : 'Yanlış cevap!');

      // Mevcut kelimeyi listeden çıkarmamız zaten handleNextWord içinde yaptığımız işe benzer.
      // 2 saniye sonra yeni bir kelime çekiyoruz.
      setTimeout(() => {
        handleNextWord();
      }, 2000);
    } catch (err) {
      console.error('Durum güncellenirken bir hata oluştu:', err.response?.data || err.message);
      alert('Kelimenin durumu güncellenirken bir hata oluştu.');
    }
  };

  // Arayüzde Card bileşenini kullanarak Quiz'i gösteriyoruz.
  return (
    <Card className="mt-5 mx-auto" style={{ maxWidth: '600px' }}>
      <Card.Body>
        <Card.Title className="text-center">Quiz</Card.Title>
        {error ? (
          <Alert variant="danger" className="text-center">{error}</Alert>
        ) : (
          <>
            {/* Eğer currentWord yoksa Quiz'e Başla butonu gösteriyoruz. */}
            {!currentWord && (
              <Button 
                onClick={handleNextWord} 
                className="mb-3 d-block mx-auto" 
                style={{backgroundColor: '#647daf', border: 'none'}}
              >
                Quiz'e Başla
              </Button>
            )}

            {/* Bir kelime seçildiyse, kullanıcının cevabını girebileceği formu gösteriyoruz. */}
            {currentWord && (
              <Alert style={{backgroundColor: '#f3f3f3'}}>
                <strong>{currentWord.word}</strong> kelimesinin Türkçesi nedir?
                <Form onSubmit={handleAnswerSubmit} className="mt-3">
                  <Form.Group controlId="userAnswer">
                    <Form.Control
                      type="text"
                      placeholder="Türkçe karşılığını yazın"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Button 
                    type="submit" 
                    className="mt-2 d-block mx-auto" 
                    style={{backgroundColor: '#647daf', border: 'none'}}
                  >
                    Cevabı Kontrol Et
                  </Button>
                </Form>
              </Alert>
            )}

            {/* Doğru ya da yanlış mesajı varsa gösteriyoruz. */}
            {feedback && (
              <Alert variant={feedback.includes('Doğru') ? 'success' : 'danger'} className="mt-3">
                {feedback}
              </Alert>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
}

// Bileşeni dışa aktarıyoruz.
export default QuizEnglish;
