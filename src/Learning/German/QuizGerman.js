// Bu bileşen, kullanıcının "learned" olarak işaretlediği Almanca kelimelerle
// quiz yapmasını sağlar.
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Alert, Button, Form } from 'react-bootstrap';

function QuizGerman() {
  // learnedWords: quiz yapılacak kelimeler
  // currentWord: o an kullanıcıya sorulan kelime
  // userAnswer: kullanıcının girdiği cevap
  // feedback: doğru ya da yanlış cevaba dair mesaj
  // error: oluşabilecek hatalar için
  const [learnedWords, setLearnedWords] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);

  // Bileşen ilk açıldığında "learned" durumundaki Almanca kelimeleri alıyoruz.
  useEffect(() => {
    fetchLearnedWords();
  }, []);

  // "learned" durumundaki kelimeleri çekmek için fonksiyon
  const fetchLearnedWords = async () => {
    try {
      const token = localStorage.getItem('jwt');

      // Kullanıcının ID'sini çekiyoruz.
      const userResponse = await axios.get('http://34.78.14.168:1337/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const userId = userResponse.data.id;

      // Almanca için lang_id=7, word_status=learned olan kelimeleri relations tablosundan çekiyoruz.
      const relationResponse = await axios.get(
        `http://34.78.14.168:1337/api/relations?populate=word_id.lang_id&filters[users_id][$eq]=${userId}&&filters[word_id][lang_id][id][$eq]=7&filters[word_status][$eq]=learned`
      );

      // Gelen verilerden quiz yapacağımız kelimeleri diziye çeviriyoruz.
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

  // Rastgele yeni bir kelime seçiyoruz ve önceki kelimeleri listeden çıkarıyoruz.
  const handleNextWord = () => {
    if (learnedWords.length > 0) {
      const randomIndex = Math.floor(Math.random() * learnedWords.length);
      const selectedWord = learnedWords[randomIndex];
      setCurrentWord(selectedWord);

      // Seçilen kelimeyi listeden çıkararak tekrar seçilmesini önlüyoruz.
      setLearnedWords((prevWords) =>
        prevWords.filter((word) => word.documentId !== selectedWord.documentId)
      );

      // Geri bildirimi ve kullanıcı cevabını sıfırlıyoruz.
      setFeedback(null);
      setUserAnswer('');
    } else {
      // Kelime kalmadıysa quiz'i tamamlıyoruz.
      setCurrentWord(null);
      setFeedback('Quiz tamamlandı!');
    }
  };

  // Kullanıcı cevap gönderdiğinde çalışacak fonksiyon
  const handleAnswerSubmit = async (e) => {
    e.preventDefault();

    if (!currentWord) return;

    // Cevap doğru mu kontrol ediyoruz
    const isCorrect = userAnswer.trim().toLowerCase() === currentWord.word_tr.toLowerCase();
    // Doğruysa "know", yanlışsa "notknow" olarak güncellemek için newStatus
    const newStatus = isCorrect ? 'know' : 'notknow';

    try {
      // Kelimenin durumunu güncelliyoruz
      await axios.put(
        `http://34.78.14.168:1337/api/relations/${currentWord.documentId}`,
        {
          data: {
            word_status: newStatus,
          },
        }
      );

      // Kullanıcıya geri bildirim gösteriyoruz
      setFeedback(isCorrect ? 'Doğru cevap!' : 'Yanlış cevap!');

      // 2 saniye bekledikten sonra bir sonraki kelimeye geçiyoruz
      setTimeout(() => {
        handleNextWord();
      }, 2000);
    } catch (err) {
      console.error('Durum güncellenirken bir hata oluştu:', err.response?.data || err.message);
      alert('Kelimenin durumu güncellenirken bir hata oluştu.');
    }
  };

  // Quiz arayüzünü Card bileşeni ile gösteriyoruz.
  return (
    <Card className="mt-5 mx-auto" style={{ maxWidth: '600px' }}>
      <Card.Body>
        <Card.Title className="text-center">Quiz</Card.Title>
        {error ? (
          <Alert variant="danger" className="text-center">{error}</Alert>
        ) : (
          <>
            {/* currentWord yoksa Quiz'e Başla butonu */}
            {!currentWord && (
              <Button 
                onClick={handleNextWord} 
                className="mb-3 d-block mx-auto" 
                style={{backgroundColor: '#647daf', border: 'none'}}
              >
                Quiz'e Başla
              </Button>
            )}
            {/* Bir kelime seçilince cevap için form gösteriyoruz */}
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
            {/* Doğru ya da yanlış mesajı */}
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
export default QuizGerman;
