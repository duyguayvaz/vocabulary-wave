// Bu bileşen, kullanıcının "learned" durumundaki İspanyolca kelimelerle
// quiz yapmasına imkan tanır.
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Alert, Button, Form } from 'react-bootstrap';

function QuizSpanish() {
  // learnedWords: quiz yapılacak kelimeler
  // currentWord: o an sorulan kelime
  // userAnswer: kullanıcının cevabı
  // feedback: doğru-yanlış geri bildirimi
  // error: oluşabilecek hata mesajları
  const [learnedWords, setLearnedWords] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);

  // Bileşen yüklendiğinde "learned" durumundaki İspanyolca kelimeleri çekiyoruz.
  useEffect(() => {
    fetchLearnedWords();
  }, []);

  // "learned" kelimeleri API'den çekerek state'e atıyoruz.
  const fetchLearnedWords = async () => {
    try {
      const token = localStorage.getItem('jwt');

      const userResponse = await axios.get('http://34.78.14.168:1337/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userId = userResponse.data.id;

      // lang_id=13 (API'de İspanyolca) ve word_status=learned olan kelimeleri alıyoruz.
      const relationResponse = await axios.get(
        `http://34.78.14.168:1337/api/relations?populate=word_id.lang_id&filters[users_id][$eq]=${userId}&&filters[word_id][lang_id][id][$eq]=13&filters[word_status][$eq]=learned`
      );

      // Kelimeleri diziye çeviriyoruz.
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

  // Yeni bir rastgele kelime seçip listeden çıkarmak için fonksiyon
  const handleNextWord = () => {
    if (learnedWords.length > 0) {
      const randomIndex = Math.floor(Math.random() * learnedWords.length);
      const selectedWord = learnedWords[randomIndex];
      setCurrentWord(selectedWord);

      // Seçilen kelimeyi listeden çıkarıyoruz ki tekrar gelmesin.
      setLearnedWords((prevWords) =>
        prevWords.filter((word) => word.documentId !== selectedWord.documentId)
      );

      setFeedback(null);
      setUserAnswer('');
    } else {
      // Kelime kalmadıysa Quiz bitti mesajı
      setCurrentWord(null);
      setFeedback('Quiz tamamlandı!');
    }
  };

  // Kullanıcı cevap gönderdiğinde çalışır.
  const handleAnswerSubmit = async (e) => {
    e.preventDefault();

    if (!currentWord) return;

    // Cevabı doğruluyoruz.
    const isCorrect = userAnswer.trim().toLowerCase() === currentWord.word_tr.toLowerCase();
    // Doğruysa "know", yanlışsa "notknow"
    const newStatus = isCorrect ? 'know' : 'notknow';

    try {
      const token = localStorage.getItem('jwt');

      // Kelimenin durumunu güncelliyoruz.
      await axios.put(
        `http://34.78.14.168:1337/api/relations/${currentWord.documentId}`,
        {
          data: {
            word_status: newStatus,
          },
        }
      );

      // Kullanıcıya doğru ya da yanlış mesajı veriyoruz.
      setFeedback(isCorrect ? 'Doğru cevap!' : 'Yanlış cevap!');

      // 2 saniye sonra yeni kelimeye geçiyoruz.
      setTimeout(() => {
        handleNextWord();
      }, 2000);
    } catch (err) {
      console.error('Durum güncellenirken bir hata oluştu:', err.response?.data || err.message);
      alert('Kelimenin durumu güncellenirken bir hata oluştu.');
    }
  };

  // Quiz arayüzü Card içinde yer alıyor.
  return (
    <Card className="mt-5 mx-auto" style={{ maxWidth: '600px' }}>
      <Card.Body>
        <Card.Title className="text-center">Quiz</Card.Title>
        {error ? (
          <Alert variant="danger" className="text-center">{error}</Alert>
        ) : (
          <>
            {/* currentWord yoksa Quiz'e Başla butonunu gösteriyoruz */}
            {!currentWord && (
              <Button
                onClick={handleNextWord}
                className="mb-3 d-block mx-auto"
                style={{backgroundColor: '#647daf', border: 'none'}}
              >
                Quiz'e Başla
              </Button>
            )}
            {/* Kelime var ise kullanıcıdan cevabı girmesini istiyoruz */}
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
            {/* Geri bildirim mesajı (Doğru ya da Yanlış) */}
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
export default QuizSpanish;
