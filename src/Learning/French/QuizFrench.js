// Bu bileşen, kullanıcının daha önce "learned" olarak işaretlediği Fransızca kelimeleri
// quiz şeklinde tekrar kontrol etmesini sağlar.
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Alert, Button, Form } from 'react-bootstrap';

function QuizFrench() {
  // learnedWords: quiz yapılacak kelimeler
  // currentWord: şu an kullanıcının cevaplaması gereken kelime
  // userAnswer: kullanıcının girdiği cevap
  // feedback: doğru ya da yanlış geri bildirimi
  // error: hata durumlarını göstermek için
  const [learnedWords, setLearnedWords] = useState([]);
  const [currentWord, setCurrentWord] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);

  // Bileşen yüklendiğinde "learned" durumundaki Fransızca kelimeleri çekiyoruz.
  useEffect(() => {
    fetchLearnedWords();
  }, []);

  // "learned" olan kelimeleri çekip state'e atıyoruz.
  const fetchLearnedWords = async () => {
    try {
      const token = localStorage.getItem('jwt');

      const userResponse = await axios.get('http://34.78.14.168:1337/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userId = userResponse.data.id;

      // lang_id=8 (API'de Fransızca) ve word_status=learned olanları çekiyoruz.
      const relationResponse = await axios.get(
        `http://34.78.14.168:1337/api/relations?populate=word_id.lang_id&filters[users_id][$eq]=${userId}&&filters[word_id][lang_id][id][$eq]=8&filters[word_status][$eq]=learned`
      );

      // Quiz için gerekli kelimeleri bir diziye çeviriyoruz.
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

  // Yeni bir kelime seçen fonksiyon.
  const handleNextWord = () => {
    if (learnedWords.length > 0) {
      // Rastgele bir kelime seçiyoruz.
      const randomIndex = Math.floor(Math.random() * learnedWords.length);
      const selectedWord = learnedWords[randomIndex];
      setCurrentWord(selectedWord);

      // Seçilen kelimeyi listeden çıkararak tekrar seçilmesini engelliyoruz.
      setLearnedWords((prevWords) => prevWords.filter((word) => word.documentId !== selectedWord.documentId));
      
      // Geri bildirim mesajını ve cevabı sıfırlıyoruz.
      setFeedback(null);
      setUserAnswer('');
    } else {
      // Kelime kalmadıysa kullanıcıya "Quiz tamamlandı" diyoruz.
      setCurrentWord(null);
      setFeedback('Quiz tamamlandı!');
    }
  };

  // Kullanıcının cevabı gönderdiğinde çalışan fonksiyon.
  const handleAnswerSubmit = async (e) => {
    e.preventDefault();

    if (!currentWord) return;

    // Cevabın doğru ya da yanlış olduğunu karşılaştırıyoruz.
    const isCorrect = userAnswer.trim().toLowerCase() === currentWord.word_tr.toLowerCase();
    const newStatus = isCorrect ? 'know' : 'notknow';

    try {
      // Kelime statüsünü güncelliyoruz.
      await axios.put(
        `http://34.78.14.168:1337/api/relations/${currentWord.documentId}`,
        {
          data: {
            word_status: newStatus,
          },
        }
      );

      // Kullanıcıya geri bildirim gösteriyoruz.
      setFeedback(isCorrect ? 'Doğru cevap!' : 'Yanlış cevap.');

      // 2 saniye sonra yeni bir kelime seçiyoruz.
      setTimeout(() => {
        handleNextWord();
      }, 2000);
    } catch (err) {
      console.error('Durum güncellenirken bir hata oluştu:', err.response?.data || err.message);
      alert('Kelimenin durumu güncellenirken bir hata oluştu.');
    }
  };

  // Quiz arayüzünü Card içinde gösteriyoruz.
  return (
    <Card className="mt-5 mx-auto" style={{ maxWidth: '600px' }}>
      <Card.Body>
        <Card.Title className="text-center">Quiz</Card.Title>
        {error ? (
          <Alert variant="danger" className="text-center">{error}</Alert>
        ) : (
          <>
            {/* currentWord seçilmediyse "Quiz'e Başla" butonunu gösteriyoruz. */}
            {!currentWord && (
              <Button 
                onClick={handleNextWord} 
                className="mb-3 d-block mx-auto" 
                style={{backgroundColor: '#647daf', border: 'none'}}
              >
                Quiz'e Başla
              </Button>
            )}

            {/* Sorulacak kelime varsa, kullanıcıdan Türkçe karşılığını girmesini istiyoruz. */}
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

            {/* Geri bildirim mesajı: Doğru cevap ya da yanlış cevap. */}
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

export default QuizFrench;
